// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {IEventProver} from "../interfaces/IEventProver.sol";
import {IntentLib} from "../libraries/IntentLib.sol";
import {SignatureLib} from "../libraries/SignatureLib.sol";
import "../types/Intent.sol";
import "../types/Receipt.sol";
import "../types/Solution.sol";
import "../types/Events.sol";
import {AIPEventPublisher} from "../common/AIPEventPublisher.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {Receipt as ReceiptStruct} from "../types/Receipt.sol";
import "./ReceiptManager.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract IntentBook is Ownable {
    // **************** //
    // **** ERRORS **** //
    // **************** //
    error IntentBook__InvalidIntentNonce();
    error IntentBook__IntentExpired();
    error IntentBook__IntentAlreadyExists(bytes32 _intentId);
    error IntentBook__UnauthorizedIntentPublisher();
    error IntentBook__CannotLockIntentThatIsNotOpen(bytes32 intentId);
    error IntentBook__UnauthorizedSolver();
    error IntentBook__CannotCancelNonOpenIntent();
    error IntentBook__UnauthorizedCancellationAttempt();
    error IntentBook__IntentsNotLocked();
    error IntentBook__ConservationPropertyViolated();
    error IntentBook__IncompleteFillGraph();
    error IntentBook__FillGraphConflictsWithOutputs();
    error IntentBook__InputOutputTokenTypeMismatch();
    error IntentBook__SolutionBurnsTokens();
    error IntentBook__SpendGraphConflictsWithOutputs();
    error IntentBook__IntentNotFound(bytes32 intentId);
    error IntentBook__EmptyIntentsAndReceipts();
    error IntentBook__InvalidReceiptIndex();
    error IntentBook__ExactAnySingleMustBeFulfilledWithReceipts(FillRecord fillRec);
    error IntentBook__UnsupportedOutcomeStructure();
    error IntentBook__UnsupportedFillStructure();
    error IntentBook__OutOfBoundsReceiptIndex();
    error IntentBook__SolutionMintsTokens();
    error IntentBook__IntentAmountMismatch();
    error IntentBook__ReceiptAmountMismatch();
    error IntentBook__UnspentInput();
    error IntentBook__InputOutputMismatch(uint256 sumInput, uint256 sumIntentOutput, uint256 sumReceiptOutput);
    error IntentBook__InvalidSignature();
    error IntentBook__IntentNotSpendable(bytes32 intentId);
    error IntentBook__InvalidIntentAuthor();
    error IntentBook__InvalidFillGraphForEASIntent();
    error IntentBook__MismatchBetweenInputAndOutputOwners();
    error IntentBook__AnySingleMustBeFulfilledWithReceipts();
    error IntentBook__InsufficientReceiptsToFillPASIntent(uint256 expectedReceiptTotal, uint256 actualReceiptTotal);

    // **************** //
    // **** EVENTS **** //
    // **************** //
    event IntentPublisherAdded(address indexed publisher);
    event IntentPublisherRevoked(address indexed publisher);
    event IntentCreated(
        bytes32 indexed intentId,
        address indexed author,
        address indexed srcMToken,
        uint256 srcAmount,
        address[] mTokens,
        uint256[] mAmounts
    );
    event IntentLocked(bytes32 indexed intentId);
    event IntentCancelled(bytes32 indexed intentId);
    event IntentSolved(bytes32 indexed intentId);

    // ******************* //
    // **** CONSTANTS **** //
    // ******************* //
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MAX_INTENT_SOLVE_SIZE_PER_BATCH = 1000;
    uint256 private constant MAX_OUTCOME_SIZE_PER_SOLUTION = 10_000;

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    uint256 private s_nonce;
    mapping(address solver => bool authorized) private s_solvers;
    mapping(address publisher => bool authorized) private s_intentPublishers;
    mapping(address author => bytes32[] intentIds) private s_userIntents;
    mapping(bytes32 intentId => SignedIntent) private s_intents;
    mapping(bytes32 intentId => IntentState) private s_intentStates;
    mapping(bytes32 childIntentId => bytes32 parentIntentId) private s_intentVersions;
    address private s_mTokenManager;
    address private s_receiptManager;
    AIPEventPublisher public s_eventPublisher;

    constructor(address _eventPublisher) Ownable() {
        s_eventPublisher = AIPEventPublisher(s_eventPublisher);
    }

    function setReceiptManager(address receiptManager) public onlyOwner {
        s_receiptManager = receiptManager;
    }

    function setTokenManager(address tokenManager) public onlyOwner {
        s_mTokenManager = tokenManager;
    }

    function getReceiptManager() public view returns (address) {
        return s_receiptManager;
    }

    function getTokenManager() public view returns (address) {
        return s_mTokenManager;
    }

    function getNonce() public view returns (uint256) {
        return s_nonce;
    }

    function incNonce() internal {
        s_nonce++;
    }

    function getIntent(bytes32 intentId) public view returns (Intent memory) {
        SignedIntent memory signedIntent = s_intents[intentId];
        return signedIntent.intent;
    }

    function getSignedIntent(bytes32 intentId) public view returns (SignedIntent memory) {
        return s_intents[intentId];
    }

    function getSignedIntents(bytes32 intentId) public view returns (SignedIntent memory) {
        return s_intents[intentId];
    }

    function getIntentState(bytes32 intentId) public view returns (IntentState) {
        return s_intentStates[intentId];
    }

    function isSolver(address solver) public view returns (bool) {
        return s_solvers[solver];
    }

    function publishIntent(SignedIntent memory signedIntent) public returns (bytes32) {
        Intent memory intent = signedIntent.intent;
        if (!s_intentPublishers[msg.sender]) {
            revert IntentBook__UnauthorizedIntentPublisher();
        }

        if (s_nonce != intent.nonce) {
            revert IntentBook__InvalidIntentNonce();
        }

        if (intent.ttl < block.timestamp) {
            revert IntentBook__IntentExpired();
        }

        if (!SignatureLib.verifyIntentSignature(signedIntent, address(this))) {
            revert IntentBook__InvalidSignature();
        }

        bytes32 intentId = getIntentId(intent);
        if (s_intentStates[intentId] != IntentState.NonExistent) {
            revert IntentBook__IntentAlreadyExists(intentId);
        }

        MTokenManager(s_mTokenManager).transferMTokensToIntent(
            intent.author,
            intentId,
            intent.srcMToken,
            intent.srcAmount,
            signedIntent
        );

        incNonce();
        s_intents[intentId] = signedIntent;
        s_intentStates[intentId] = IntentState.Open;
        s_userIntents[intent.author].push(intentId);

        emit IntentCreated(
            intentId, intent.author, intent.srcMToken, intent.srcAmount, intent.outcome.mTokens, intent.outcome.mAmounts
        );

        return intentId;
    }

    function validateSolutionInputs(Solution memory solution) public view returns (Intent[] memory) {
        Intent[] memory intentsSpent = new Intent[](solution.intentIds.length);
        for (uint256 i = 0; i < solution.intentIds.length; i++) {
            bytes32 intentId = solution.intentIds[i];

            SignedIntent memory currIntent = getSignedIntent(intentId);
            if (!checkIntentValidToSpend(currIntent)) {
                revert IntentBook__IntentNotSpendable(intentId);
            }
            if (currIntent.intent.author == address(0)) {
                revert IntentBook__IntentNotFound(intentId);
            }
            if (currIntent.intent.ttl < block.number) {
                revert IntentBook__IntentExpired();
            }
            intentsSpent[i] = currIntent.intent;
        }
        return intentsSpent;
    }

    function addPublisher(address newPublisher) external onlyOwner {
        s_intentPublishers[newPublisher] = true;
        emit IntentPublisherAdded(newPublisher);
    }

    function removePublisher(address publisher) external onlyOwner {
        s_intentPublishers[publisher] = false;
        emit IntentPublisherRevoked(publisher);
    }

    function addSolver(address newSolver) external onlyOwner {
        s_solvers[newSolver] = true;
    }

    function removeSolver(address newSolver) external onlyOwner {
        s_solvers[newSolver] = false;
    }

    function solve(Solution memory _solution) public returns (bytes32) {
        Intent[] memory consumedIntents = validateSolutionInputs(_solution);
        bytes32[] memory consumedIntentIds = _solution.intentIds;
        lockIntents(consumedIntentIds);
        Intent[] memory outputIntents = _solution.intentOutputs;
        Receipt[] memory outputReceipts = _solution.receiptOutputs;
        MoveRecord[] memory spendGraph = _solution.spendGraph;
        FillRecord[] memory fillGraph = _solution.fillGraph;

        verifySolutionInvariants(consumedIntents, outputIntents, outputReceipts, spendGraph, fillGraph);
        checkIntentSatisfaction(consumedIntents, outputIntents, outputReceipts, fillGraph);
        if (outputReceipts.length > 0) {
            issueReceiptsAndTransferMTokens(outputReceipts, consumedIntents, spendGraph);
        }

        finalizeSolution(consumedIntentIds, consumedIntents, outputIntents, spendGraph);
        return keccak256(abi.encode(consumedIntentIds, outputIntents, outputReceipts, spendGraph, fillGraph));
    }

    function finalizeSolution(
        bytes32[] memory consumedIntentIds,
        Intent[] memory consumedIntents,
        Intent[] memory outputIntents,
        MoveRecord[] memory spendGraph
    ) internal {
        for (uint256 i = 0; i < consumedIntentIds.length; i++) {
            s_intentStates[consumedIntentIds[i]] = IntentState.Solved;
        }
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            Intent memory intent = consumedIntents[i];
            bytes32 intentId = getIntentId(intent);
            emit IntentSolved(intentId);
        }

        MoveRecord memory currMoveRec;
        for (uint256 i = 0; i < spendGraph.length; i++) {
            currMoveRec = spendGraph[i];
            if (currMoveRec.outputIdx.outType == OutType.Intent) {
                Intent memory spentIntent = consumedIntents[currMoveRec.srcIdx];
                Intent memory createdIntent = outputIntents[currMoveRec.outputIdx.outIdx];
                if (createdIntent.author != spentIntent.author) {
                    revert IntentBook__InvalidIntentAuthor();
                }

                SignedIntent memory signedCreatedIntent = SignedIntent({intent: createdIntent, signature: bytes("")});
                bytes32 outputIntentId = getIntentId(createdIntent);
                bytes32 spentIntentId = getIntentId(spentIntent);
                s_intentVersions[outputIntentId] = spentIntentId;
                s_userIntents[createdIntent.author].push(outputIntentId);
                s_intents[outputIntentId] = signedCreatedIntent;
                s_intentStates[outputIntentId] = IntentState.Open;
                s_nonce++;
                emit IntentCreated(
                    outputIntentId,
                    createdIntent.author,
                    createdIntent.srcMToken,
                    createdIntent.srcAmount,
                    createdIntent.outcome.mTokens,
                    createdIntent.outcome.mAmounts
                );
            }
        }
    }

    function verifyIntentSignature(SignedIntent memory signedIntent) public view returns (bool) {
        Intent memory intent = signedIntent.intent;

        // Ensure the signature is the correct length (65 bytes: r, s, v)
        require(signedIntent.signature.length == 65, "Invalid signature length");

        bytes32 intentHash = IntentLib.hashIntent(intent, address(this));

        // Verify the signature using ECDSA.recover
        address recoveredAddress = ECDSA.recover(intentHash, signedIntent.signature);

        // Check if the recovered address matches the intent's author
        return recoveredAddress == intent.author;
    }

    // Intent is spendable if the signature is valid for the intent or if it is a child of an ancestor intent that is spendable
    function checkIntentValidToSpend(SignedIntent memory signedIntent) public view returns (bool) {
        bytes32 intentId = getIntentId(signedIntent.intent);
        if (s_intentStates[intentId] != IntentState.Open) {
            return false;
        }
        if (s_intentVersions[intentId] == bytes32(0)) {
            if (verifyIntentSignature(signedIntent)) {
                return true;
            } else {
                return false;
            }
        } else {
            // We actually don't need to perform a chained lookup here, since we know that the child intent can only be created if its predecessor was spendable
            return true;
        }
    }

    function getIntentId(Intent memory intent) public view returns (bytes32) {
        return IntentLib.hashIntent(intent, address(this));
    }

    function cancelIntent(bytes32 intentId) external {
        if (s_intentStates[intentId] != IntentState.Open) {
            revert IntentBook__CannotCancelNonOpenIntent();
        }

        Intent memory intent = getIntent(intentId);
        if (intent.author != msg.sender) {
            revert IntentBook__UnauthorizedCancellationAttempt();
        }

        s_intentStates[intentId] = IntentState.Cancelled;

        emit IntentCancelled(intentId);
    }

    function lockIntents(bytes32[] memory intentIds) public onlyOwner {
        for (uint256 i = 0; i < intentIds.length; i++) {
            bytes32 intentId = intentIds[i];
            lockIntent(intentId);
        }
    }

    function lockIntent(bytes32 intentId) public onlyOwner {
        IntentState intentState = s_intentStates[intentId];
        if (intentState != IntentState.Open) {
            revert IntentBook__CannotLockIntentThatIsNotOpen(intentId);
        }
        s_intentStates[intentId] = IntentState.Locked;
        emit IntentLocked(intentId);
    }

    function checkConservationProperty(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntent,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph
    ) internal pure returns (bool) {
        uint256[] memory spentAmtMap = new uint256[](consumedIntents.length);

        for (uint256 i = 0; i < spendGraph.length; i++) {
            (uint64 srcIdx, OutputIdx memory oIdx) = (spendGraph[i].srcIdx, spendGraph[i].outputIdx);
            (OutType outType, uint256 outIdx) = (oIdx.outType, oIdx.outIdx);

            uint256 inAmt = consumedIntents[srcIdx].srcAmount;
            uint256 outAmt;
            if (outType == OutType.Intent) {
                outAmt = createdIntent[outIdx].srcAmount;
            } else {
                outAmt = createdReceipts[outIdx].mTokenAmount;
            }
            spentAmtMap[srcIdx] += outAmt;
            if (spentAmtMap[srcIdx] > inAmt) {
                revert IntentBook__ConservationPropertyViolated();
            }
        }

        for (uint256 i = 0; i < spentAmtMap.length; i++) {
            uint256 consumedIntentAmt = consumedIntents[i].srcAmount;
            uint256 actualSpentAmt = spentAmtMap[i];
            if (consumedIntentAmt != actualSpentAmt) {
                return false;
            }
        }
        return true;
    }

    function verifySolutionInvariants(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntent,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph,
        FillRecord[] memory fillGraph
    ) internal pure returns (bool) {
        // Validate that at least one output (intent or receipt) exists
        validateNotEmpty(createdIntent, createdReceipts);

        // Validate resource usage (inputs vs outputs)
        validateResourceInvariants(consumedIntents, createdIntent, createdReceipts, spendGraph);

        return true;
    }

    function validateNotEmpty(Intent[] memory createdIntent, Receipt[] memory createdReceipts) internal pure {
        if (createdIntent.length == 0 && createdReceipts.length == 0) {
            revert IntentBook__EmptyIntentsAndReceipts();
        }
    }

    function validateResourceInvariants(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntent,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph
    ) internal pure {
        uint256 sumInput = 0;
        uint256 sumReceiptOutput = 0;
        uint256 sumIntentOutput = 0;
        uint256[] memory intentBalancesSpent = new uint256[](consumedIntents.length);

        // Sum input amounts
        sumInput = sumInputAmounts(consumedIntents, intentBalancesSpent);

        // Validate spend graph
        (sumIntentOutput, sumReceiptOutput) =
            validateSpendGraph(consumedIntents, createdIntent, createdReceipts, spendGraph, intentBalancesSpent);

        // Ensure that total inputs match total outputs
        if (sumIntentOutput + sumReceiptOutput != sumInput) {
            revert IntentBook__InputOutputMismatch(sumInput, sumIntentOutput, sumReceiptOutput);
        }
    }

    function sumInputAmounts(Intent[] memory consumedIntents, uint256[] memory intentBalancesSpent)
        internal
        pure
        returns (uint256)
    {
        uint256 sumInput = 0;
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            uint256 currIntentAmt = consumedIntents[i].srcAmount;
            intentBalancesSpent[i] = currIntentAmt;
            sumInput += currIntentAmt;
        }
        return sumInput;
    }

    function validateSpendGraph(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntent,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph,
        uint256[] memory intentBalancesSpent
    ) internal pure returns (uint256 sumIntentOutput, uint256 sumReceiptOutput) {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            uint64 currIdx = moveRec.srcIdx;

            if (currIdx >= consumedIntents.length) {
                revert IntentBook__SolutionMintsTokens();
            }

            Intent memory currIntent = consumedIntents[currIdx];
            uint256 quantitySpent = moveRec.qty;
            uint256 intentSrcQuantity = intentBalancesSpent[currIdx];

            // Check if tokens are being minted by ensuring no overspending
            if (intentSrcQuantity < quantitySpent) {
                revert IntentBook__SolutionMintsTokens();
            }

            // Validate intent or receipt outputs
            if (moveRec.outputIdx.outType == OutType.Intent && createdIntent.length > 0) {
                Intent memory spendingIntent = createdIntent[moveRec.outputIdx.outIdx];
                if (currIntent.srcMToken != spendingIntent.srcMToken) {
                    revert IntentBook__InputOutputTokenTypeMismatch();
                }
                if (spendingIntent.srcAmount < quantitySpent) {
                    revert IntentBook__IntentAmountMismatch();
                }

                sumIntentOutput += quantitySpent;
            } else {
                Receipt memory spendingReceipt = createdReceipts[moveRec.outputIdx.outIdx];
                if (currIntent.srcMToken != spendingReceipt.mToken) {
                    revert IntentBook__InputOutputTokenTypeMismatch();
                }
                if (spendingReceipt.mTokenAmount < quantitySpent) {
                    revert IntentBook__ReceiptAmountMismatch();
                }

                sumReceiptOutput += quantitySpent;
            }

            // Update the balance of the consumed intent
            intentBalancesSpent[currIdx] -= quantitySpent;
        }
    }

    // ************************************ //
    // *** Validate Intent Fulfillment **** //
    // ************************************ //

    /*
        The outcome expressed by the intent is determined by both its 
        OutcomeAssetStructure (AnySingle, Any, All) and its FillStructure (Exactly, Minimum, PctFilled, ConcreteRange)

        OutcomeAssetStructure defines how the Outcome.mTokens will be interpreted:
            - AnySingle: The intent must be filled entirely with any of the tokens in Outcome.mTokens
            - Any: The intent must be filled with any collection of the tokens in Outcome.mTokens
            - All: The outcome must be filled by a combination of all tokens in Outcome.mTokens
        
        FillStructure defines how Outcome.amts will be interpreted
            - Exactly: Outcome.amt denotes an exact amount expected in the outputs
            - Minimum: Outcome.amt denotes a minimum amount expected in the outputs
            - PctFilled: receivedTokens >= srcTokens * Outcome.amt .
            - Concrete range: (srcAmt - Outcome.amt) <= receivedTokens <= (srcAmt + Outcome.amt)

        How Outcome.amts applies depends on the asset structure. Outcome.amts.length MUST EITHER be 1 OR be equal to Outcome.mTokens.length.
        For the rest of this comment, we will denote the situation in which Outcome.amts.length == 1 as "token-independent pricing" and the situation in which
        Outcome.amts.length == Outcome.mTokens.length as "token-dependent pricing". We will use 'amtReceived' to denote the amount of some token
            - AnySingle
                - Exactly: Outcome.amts.length must equal 1 OR must equal Outcome.mTokens.length. 
                           If Outcome.amts.length == 1, then amtReceived == Outcome.amts[0] no matter the token.
                           If Outcome.amts.length == Outcome.mTokens.length, then if tokenReceived == Outcome.mTokens[i] then amtReceived == Outcome.amts[i]
                - Minimum: The same as Exactly, but replace '==' with '>='
                - PctFilled: If token-independent pricing, then amtReceived >= srcAmt * Outcome.amts[0]. If token-dependent, then amtReceived of tokenReceived 
                             (where tokenReceived == Outcome.mTokens[i] for some i) >= srcAmt * Outcome.amts[i]
                             
                - ConcreteRange: 
            - Any
                - Exactly:
                - Minimum:
                - PctFilled:
                - ConcreteRange:
            - All
                - Exactly: If token-independent, then Sum(tokensReceived) == Outcome.amts[0]. If token-dependent, then for each tokenReceived (Outcome.mTokens[i]), amtReceived of tokenReceived
                           must equal Outcome.amts[i]
                - Minimum: Same as 'Exactly' but replace '==' with '>='
                - PctFilled: 
                - ConcreteRange:
    */

    function checkIntentSatisfaction(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts,
        FillRecord[] memory fillGraph
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            FillRecord[] memory fillersForCurrInput = getAllFillersFor(i, fillGraph);

            Intent memory inputIntent = consumedIntents[i];
            _checkIntentSatisfaction(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
        }
    }

    function _checkIntentSatisfaction(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts
    ) internal pure {
        if (inputIntent.outcome.outcomeAssetStructure == OutcomeAssetStructure.AnySingle) {
            if (inputIntent.outcome.fillStructure == FillStructure.Exactly) {
                //revert("Reached FILL EAS branch in checkIntentSatisfaction");
                _checkFilledEAS(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
            } else if (inputIntent.outcome.fillStructure == FillStructure.PctFilled) {
                //revert("Reached FILL PAS branch in checkIntentSatisfaction");
                _checkFilledPAS(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
            } else {
                revert IntentBook__UnsupportedFillStructure();
            }
        } else {
            revert IntentBook__UnsupportedOutcomeStructure();
        }
    }

    function _checkFilledEAS(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts
    ) internal pure {
        if (fillersForCurrInput.length != 1) {
            revert IntentBook__InvalidFillGraphForEASIntent();
        }
        FillRecord memory currFiller = fillersForCurrInput[0];
        if (currFiller.outType == OutType.Intent) {
            revert IntentBook__ExactAnySingleMustBeFulfilledWithReceipts(currFiller);
        }
        Receipt memory fillerReceipt = createdReceipts[currFiller.outIdx];
        if (inputIntent.outcome.mTokens[0] != fillerReceipt.mToken) {
            revert IntentBook__InputOutputTokenTypeMismatch();
        }
        if (inputIntent.outcome.mAmounts[0] != fillerReceipt.mTokenAmount) {
            revert IntentBook__IntentAmountMismatch();
        }
        if (inputIntent.author != fillerReceipt.owner) {
            revert IntentBook__MismatchBetweenInputAndOutputOwners();
        }
    }

    function _intentAcceptsMToken(Intent memory intent, address mToken) internal pure returns (bool) {
        for (uint256 i = 0; i < intent.outcome.mTokens.length; i++) {
            if (intent.outcome.mTokens[i] == mToken) {
                return true;
            }
        }
        return false;
    }

    function _outcomeAmtForMToken(Intent memory intent, address mToken) internal pure returns (uint256) {
        for (uint256 i = 0; i < intent.outcome.mTokens.length; i++) {
            if (intent.outcome.mTokens[i] == mToken) {
                return intent.outcome.mAmounts[i];
            }
        }
        return 0;
    }

    function _checkFilledPAS(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts
    ) internal pure {
        uint256 initialIntentSrcTokenBalance = inputIntent.srcAmount;
        uint256 finalIntentSrcTokenBalance = 0;
        uint256 receiptTotal = 0;
        address mTokenReceived;
        uint256 percentageExpectedForMTokenReceived;

        bool outputIntentForInputExists = false;
        for (uint256 i = 0; i < fillersForCurrInput.length; i++) {
            FillRecord memory currFiller = fillersForCurrInput[i];
            if (currFiller.outType == OutType.Intent) {
                if (outputIntentForInputExists) {
                    revert("Only 1 output intent allowed for each partially fillable intent");
                }
                Intent memory outputIntent = createdIntents[currFiller.outIdx];
                if (outputIntent.srcMToken != inputIntent.srcMToken) {
                    revert("Intent srcMToken should not change");
                }
                bytes32 outputOutcomeHash = IntentLib.hashOutcome(outputIntent.outcome);
                bytes32 inputOutcomeHash = IntentLib.hashOutcome(inputIntent.outcome);
                if (outputOutcomeHash != inputOutcomeHash) {
                    revert("Outcome should not change");
                }
                outputIntentForInputExists = true;
                finalIntentSrcTokenBalance = createdIntents[currFiller.outIdx].srcAmount;
            } else {
                Receipt memory currReceipt = createdReceipts[currFiller.outIdx];
                if (mTokenReceived != address(0)) {
                    if (currReceipt.mToken != mTokenReceived) {
                        revert(
                            "Cannot use multiple mTokens in a single solution for an intent with AnySingle asset structure"
                        );
                    }
                } else {
                    if (_intentAcceptsMToken(inputIntent, currReceipt.mToken)) {
                        mTokenReceived = currReceipt.mToken;
                        percentageExpectedForMTokenReceived = _outcomeAmtForMToken(inputIntent, currReceipt.mToken);
                        if (percentageExpectedForMTokenReceived == 0) {
                            revert("Critical error: percentage-based fill should never have outcome amount of 0");
                        }
                    } else {
                        revert("Invalid mToken given to partially fillable intent");
                    }
                }
                receiptTotal += currReceipt.mTokenAmount;
            }
        }

        if (finalIntentSrcTokenBalance > initialIntentSrcTokenBalance) {
            revert("Intent balance should not increase");
        }

        uint256 tokensTakenFromInput = initialIntentSrcTokenBalance - finalIntentSrcTokenBalance;
        uint256 expectedReceiptAmount = ((tokensTakenFromInput * percentageExpectedForMTokenReceived) / 10 ** 18) / 100;
        if (receiptTotal < expectedReceiptAmount) {
            revert IntentBook__InsufficientReceiptsToFillPASIntent(expectedReceiptAmount, receiptTotal);
        }
    }

    function getAllFillersFor(uint256 inputIntentIdx, FillRecord[] memory fillGraph)
        internal
        pure
        returns (FillRecord[] memory)
    {
        uint256 fillerCount;
        for (uint256 i = 0; i < fillGraph.length; i++) {
            if (fillGraph[i].inIdx == inputIntentIdx) {
                fillerCount++;
            }
        }
        FillRecord[] memory allFillers = new FillRecord[](fillerCount);
        uint256 j = 0;
        for (uint256 i = 0; i < fillGraph.length; i++) {
            if (fillGraph[i].inIdx == inputIntentIdx) {
                allFillers[j] = fillGraph[i];
                j++;
            }
        }

        return allFillers;
    }

    function solutionHash(Solution memory solution) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(solution.intentIds, solution.intentOutputs, solution.receiptOutputs, solution.spendGraph)
        );
    }

    function issueReceiptsAndTransferMTokens(
        ReceiptStruct[] memory outputReceipts,
        Intent[] memory consumedIntents,
        MoveRecord[] memory spendGraph
    ) internal {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            if (moveRec.outputIdx.outType == OutType.Receipt) {
                uint256 sourceIntentIdx = moveRec.srcIdx;
                uint256 outReceiptIdx = moveRec.outputIdx.outIdx;
                ReceiptStruct memory receipt = outputReceipts[outReceiptIdx];
                Intent memory intent = consumedIntents[sourceIntentIdx];

                // Create the receipt for the filled portion via the ReceiptManager
                bytes32 receiptId = ReceiptManager(s_receiptManager).createReceipt(
                    receipt.owner, receipt.mToken, receipt.mTokenAmount, getIntentId(intent)
                );

                // Transfer MTokens to the receipt via MTokenManager
                MTokenManager(s_mTokenManager).transferMTokensToReceipt(getIntentId(intent), receiptId, intent.srcMToken, receipt.mTokenAmount);

            }
        }
    }
}
