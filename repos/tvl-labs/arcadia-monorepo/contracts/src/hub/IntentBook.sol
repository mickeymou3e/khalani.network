// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {AccessManaged} from "@oz5/contracts/access/manager/AccessManaged.sol";
import {IntentLib} from "../libraries/IntentLib.sol";
import {SignatureLib} from "../libraries/SignatureLib.sol";
import {SolutionLib} from "../libraries/SolutionLib.sol";
import {MTokenManager} from "./MTokenManager.sol";
import {ReceiptManager} from "./ReceiptManager.sol";
import "../types/Intent.sol";
import "../types/Receipt.sol";
import "../types/Solution.sol";

contract IntentBook is AccessManaged {
    // **************** //
    // **** ERRORS **** //
    // **************** //
    error IntentBook__InvalidIntentNonce();
    error IntentBook__IntentExpired();
    error IntentBook__IntentAlreadyExists(bytes32 _intentId);
    error IntentBook__UnauthorizedIntentPublisher();
    error IntentBook__CannotLockIntentThatIsNotOpen(bytes32 intentId);
    error IntentBook__CannotCancelNonOpenIntent();
    error IntentBook__UnauthorizedCancellationAttempt();
    error IntentBook__InvalidSignature();
    error IntentBook__InvalidIntentAuthor();
    error IntentBook__IntentNotSpendable(bytes32 intentId);
    error IntentBook__IntentNotFound(bytes32 intentId);
    error IntentBook__CannotSpendIntentThatIsNotOpen(bytes32 intentId);
    error IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
    error IntentBook__IntentVersionsCannotChangeTtlWhenSpent();
    error IntentBook__FillGraphCannotBeEmpty();
    error IntentBook__IntentPredecessorRootDoesNotMatch();
    error IntentBook__IntentIdAuthorMismatch();

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
        uint256[] mAmounts,
        OutcomeAssetStructure outcomeAssetStructure,
        FillStructure fillStructure
    );
    event IntentLocked(bytes32 indexed intentId);
    event IntentCancelled(bytes32 indexed intentId);
    event IntentSolved(bytes32 indexed intentId);

    // 1%
    uint256 public constant DEFAULT_MINIMUM_FILL_PERCENTAGE = 10 ** 18;
    uint256 public constant DEFAULT_MAX_LOCK_DURATION = 1 hours;

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    mapping(address user => uint256 nonce) private s_userNonces;
    mapping(address publisher => bool authorized) private s_intentPublishers;
    mapping(address author => bytes32[] intentIds) private s_userIntents;
    mapping(bytes32 intentId => SignedIntent) private s_intents;
    mapping(bytes32 intentId => IntentState) private s_intentStates;
    mapping(bytes32 childIntentId => bytes32 parentIntentId) private s_intentVersions;
    mapping(bytes32 tipIntentId => bytes32 rootIntentId) private s_intentRoots;
    address private s_mTokenManager;
    address private s_receiptManager;
    address private s_solutionLib;

    uint256 public s_minimumFillPercentage;
    uint256 public s_maxLockDuration;

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //
    constructor(address solutionLib, address manager) AccessManaged(manager) {
        s_solutionLib = solutionLib;
        s_minimumFillPercentage = DEFAULT_MINIMUM_FILL_PERCENTAGE;
        s_maxLockDuration = DEFAULT_MAX_LOCK_DURATION;
    }

    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //

    //Restricted to intentbook admin
    function addPublisher(address newPublisher) external restricted {
        s_intentPublishers[newPublisher] = true;
        emit IntentPublisherAdded(newPublisher);
    }
    //Restricted to intentbook admin

    function removePublisher(address publisher) external restricted {
        s_intentPublishers[publisher] = false;
        emit IntentPublisherRevoked(publisher);
    }

    function cancelIntentForAuthor(bytes32 intentId, address author) external restricted {
        if (s_intentStates[intentId] != IntentState.Open) {
            revert IntentBook__CannotCancelNonOpenIntent();
        }

        Intent memory intent = getIntent(intentId);
        if (intent.author != author) {
            revert IntentBook__IntentIdAuthorMismatch();
        }
        s_intentStates[intentId] = IntentState.Cancelled;

        MTokenManager(s_mTokenManager).transferMTokensFromIntent(
            intentId, intent.author, intent.srcMToken, intent.srcAmount
        );
        emit IntentCancelled(intentId);
    }

    function cancelIntent(bytes32 intentId) external restricted {
        if (s_intentStates[intentId] != IntentState.Open) {
            revert IntentBook__CannotCancelNonOpenIntent();
        }

        Intent memory intent = getIntent(intentId);

        s_intentStates[intentId] = IntentState.Cancelled;
        MTokenManager(s_mTokenManager).transferMTokensFromIntent(
            intentId, intent.author, intent.srcMToken, intent.srcAmount
        );

        emit IntentCancelled(intentId);
    }

    // ***************** //
    // **** PUBLIC **** //
    // ***************** //
    function setReceiptManager(address receiptManager) public restricted {
        s_receiptManager = receiptManager;
    }

    function setTokenManager(address tokenManager) public restricted {
        s_mTokenManager = tokenManager;
    }

    function setMinimumFillPercentage(uint256 minimumFillPercentage) public restricted {
        s_minimumFillPercentage = minimumFillPercentage;
    }

    function setMaxLockDuration(uint256 maxLockDuration) public restricted {
        s_maxLockDuration = maxLockDuration;
    }

    function publishIntent(SignedIntent memory signedIntent) public returns (bytes32) {
        Intent memory intent = signedIntent.intent;
        if (!s_intentPublishers[msg.sender]) {
            revert IntentBook__UnauthorizedIntentPublisher();
        }

        // Intent's nonce for author must be greater than the last nonce used.
        if (s_userNonces[signedIntent.intent.author] >= intent.nonce) {
            revert IntentBook__InvalidIntentNonce();
        }

        if (intent.ttl < block.number) {
            revert IntentBook__IntentExpired();
        }

        if (intent.outcome.fillStructure == FillStructure.PctFilled) {
            for (uint256 i = 0; i < intent.outcome.mAmounts.length; i++) {
                require(
                    intent.outcome.mAmounts[i] % (10 ** 13) == 0, "IntentBook: mAmounts must yield manageable outcomes"
                );
            }
        }

        if (!SignatureLib.verifyIntentSignature(signedIntent, address(this))) {
            revert IntentBook__InvalidSignature();
        }

        bytes32 intentId = getIntentId(intent);
        if (s_intentStates[intentId] != IntentState.NonExistent) {
            revert IntentBook__IntentAlreadyExists(intentId);
        }

        setNonce(signedIntent.intent.author, signedIntent.intent.nonce);
        s_intents[intentId] = signedIntent;
        s_intentStates[intentId] = IntentState.Open;
        s_userIntents[intent.author].push(intentId);
        s_intentRoots[intentId] = intentId;

        emit IntentCreated(
            intentId,
            intent.author,
            intent.srcMToken,
            intent.srcAmount,
            intent.outcome.mTokens,
            intent.outcome.mAmounts,
            intent.outcome.outcomeAssetStructure,
            intent.outcome.fillStructure
        );

        MTokenManager(s_mTokenManager).transferMTokensToIntent(
            intent.author, intentId, intent.srcMToken, intent.srcAmount, signedIntent
        );

        return intentId;
    }

    // medusa or intent owner
    function lockIntents(bytes32[] memory intentIds) public restricted {
        for (uint256 i = 0; i < intentIds.length; i++) {
            bytes32 intentId = intentIds[i];
            lockIntent(intentId);
        }
    }

    // medusa or intent owner
    function lockIntent(bytes32 intentId) public restricted {
        IntentState intentState = s_intentStates[intentId];
        if (intentState != IntentState.Open) {
            revert IntentBook__CannotLockIntentThatIsNotOpen(intentId);
        }
        s_intentStates[intentId] = IntentState.Locked;
        emit IntentLocked(intentId);
    }

    // restricted to updater role
    function solve(Solution memory _solution) public restricted returns (bytes32) {
        Intent[] memory consumedIntents = validateSolutionInputs(_solution);
        bytes32[] memory consumedIntentIds = _solution.intentIds;
        lockIntents(consumedIntentIds);
        Intent[] memory outputIntents = _solution.intentOutputs;
        Receipt[] memory outputReceipts = _solution.receiptOutputs;
        MoveRecord[] memory spendGraph = _solution.spendGraph;
        FillRecord[] memory fillGraph = _solution.fillGraph;

        if (fillGraph.length == 0) {
            revert IntentBook__FillGraphCannotBeEmpty();
        }

        SolutionLib(s_solutionLib).verifySolutionInvariants(
            consumedIntents, outputIntents, outputReceipts, spendGraph, fillGraph
        );
        SolutionLib(s_solutionLib).checkIntentSatisfaction(
            consumedIntents, outputIntents, outputReceipts, fillGraph, s_minimumFillPercentage
        );

        if (outputReceipts.length > 0) {
            // issueReceiptsAndTransferMTokens(outputReceipts, consumedIntents, spendGraph);
            transferMTokensFromIntentToReceiptRecipients(outputReceipts, consumedIntents, spendGraph);
        }

        finalizeSolution(consumedIntentIds, consumedIntents, outputIntents, spendGraph);
        return keccak256(abi.encode(consumedIntentIds, outputIntents, outputReceipts, spendGraph, fillGraph));
    }

    // ***************** //
    // **** INTERNAL **** //
    // ***************** //

    function incNonce() internal {
        s_userNonces[msg.sender]++;
    }

    function incNonce(address _user) internal {
        s_userNonces[_user]++;
    }

    function setNonce(address _user, uint256 _nonce) internal {
        if (_nonce > s_userNonces[_user]) {
            s_userNonces[_user] = _nonce;
        }
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
                uint256 authorNonce = s_userNonces[createdIntent.author]++;
                createdIntent.nonce = authorNonce;
                // setNonce(createdIntent.author, authorNonce);

                SignedIntent memory signedCreatedIntent = SignedIntent({intent: createdIntent, signature: bytes("")});
                bytes32 outputIntentId = getIntentId(createdIntent);
                bytes32 spentIntentId = getIntentId(spentIntent);
                if (outputIntentId == spentIntentId) {
                    revert IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
                }
                if (spentIntent.ttl != createdIntent.ttl) {
                    revert IntentBook__IntentVersionsCannotChangeTtlWhenSpent();
                }
                if (spentIntent.srcAmount == createdIntent.srcAmount) {
                    revert IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
                }

                // Root to track the root ancestor of an intent
                if (s_intentRoots[spentIntentId] == spentIntentId) {
                    // If the spent intent IS the root intent, set the child's root to the spent intent id.
                    s_intentRoots[outputIntentId] = spentIntentId;
                } else {
                    // If the spent intent is NOT the root intent, set the child intent's root to the spent intent's root.
                    s_intentRoots[outputIntentId] = s_intentRoots[spentIntentId];
                }

                // We still track the ordering of the versions for the sake of provenance.
                // It is not used for validation, however.
                s_intentVersions[outputIntentId] = spentIntentId;
                s_userIntents[createdIntent.author].push(outputIntentId);
                s_intents[outputIntentId] = signedCreatedIntent;
                s_intentStates[outputIntentId] = IntentState.Open;
                MTokenManager(s_mTokenManager).transferMTokensFromIntent(
                    createdIntent.author,
                    spentIntentId,
                    outputIntentId,
                    createdIntent.srcMToken,
                    createdIntent.srcAmount,
                    spentIntent
                );
                emit IntentCreated(
                    outputIntentId,
                    createdIntent.author,
                    createdIntent.srcMToken,
                    createdIntent.srcAmount,
                    createdIntent.outcome.mTokens,
                    createdIntent.outcome.mAmounts,
                    createdIntent.outcome.outcomeAssetStructure,
                    createdIntent.outcome.fillStructure
                );
            }
        }
    }

    function transferMTokensFromIntentToReceiptRecipients(
        Receipt[] memory outputReceipts,
        Intent[] memory consumedIntents,
        MoveRecord[] memory spendGraph
    ) internal {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            if (moveRec.outputIdx.outType == OutType.Receipt) {
                Intent memory inputIntent = consumedIntents[moveRec.srcIdx];
                Receipt memory outReceipt = outputReceipts[moveRec.outputIdx.outIdx];
                bytes32 intentId = IntentLib.hashIntent(inputIntent);
                MTokenManager(s_mTokenManager).transferMTokensFromIntent(
                    intentId, outReceipt.owner, outReceipt.mToken, outReceipt.mTokenAmount
                );
            }
        }
    }

    function issueReceiptsAndTransferMTokens(
        Receipt[] memory outputReceipts,
        Intent[] memory consumedIntents,
        MoveRecord[] memory spendGraph
    ) internal {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            if (moveRec.outputIdx.outType == OutType.Receipt) {
                uint256 sourceIntentIdx = moveRec.srcIdx;
                uint256 outReceiptIdx = moveRec.outputIdx.outIdx;
                Receipt memory receipt = outputReceipts[outReceiptIdx];
                Intent memory intent = consumedIntents[sourceIntentIdx];
                bytes32 intentId = IntentLib.hashIntent(intent);

                bytes32 receiptId = ReceiptManager(s_receiptManager).createReceipt(
                    receipt.owner, receipt.mToken, receipt.mTokenAmount, intentId
                );

                MTokenManager(s_mTokenManager).transferMTokensToReceipt(
                    intentId, receiptId, intent.srcMToken, receipt.mTokenAmount
                );
            }
        }
    }

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    function getReceiptManager() public view returns (address) {
        return s_receiptManager;
    }

    function getTokenManager() public view returns (address) {
        return s_mTokenManager;
    }

    function getNonce(address _user) public view returns (uint256) {
        return s_userNonces[_user];
    }

    function getNonce() public view returns (uint256) {
        return s_userNonces[msg.sender];
    }

    function getIntent(bytes32 intentId) public view returns (Intent memory) {
        SignedIntent memory signedIntent = s_intents[intentId];
        return signedIntent.intent;
    }

    function getSignedIntent(bytes32 intentId) public view returns (SignedIntent memory) {
        return s_intents[intentId];
    }

    function getIntentState(bytes32 intentId) public view returns (IntentState) {
        return s_intentStates[intentId];
    }

    function getIntentIdsByAuthor(address author) public view returns (bytes32[] memory) {
        return s_userIntents[author];
    }

    function validateSolutionInputs(Solution memory solution) public view returns (Intent[] memory) {
        Intent[] memory intentsSpent = new Intent[](solution.intentIds.length);
        for (uint256 i = 0; i < solution.intentIds.length; i++) {
            bytes32 intentId = solution.intentIds[i];

            SignedIntent memory currIntent = getSignedIntent(intentId);
            bool isValidToSpend = checkIntentValidToSpend(currIntent);
            // should never happen because it will revert if not spendable
            if (!isValidToSpend) {
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

    function getIntentId(Intent memory intent) public view returns (bytes32) {
        return IntentLib.hashIntent(intent);
    }

    function getIntentChainRoot(bytes32 intentId) public view returns (bytes32) {
        return s_intentRoots[intentId];
    }

    // Intent is spendable if the signature is valid for the intent or if it is a child of an ancestor intent that is spendable
    function checkIntentValidToSpend(SignedIntent memory signedIntent) public view returns (bool) {
        bytes32 intentId = getIntentId(signedIntent.intent);
        if (s_intentStates[intentId] != IntentState.Open) {
            revert IntentBook__CannotSpendIntentThatIsNotOpen(intentId);
        }
        if (s_intentVersions[intentId] == bytes32(0)) {
            if (!SignatureLib.verifyIntentSignature(signedIntent, address(this))) {
                revert IntentBook__InvalidSignature();
            }
        }
        /*
            Cases: 
                - intent is the first intent created. In this case, the above check suffices and this part of code will not be reached.
                - roots[intent] == roots[predecessor] AND roots[predecessor] == predecessor. This happens when the predecessor is also the root intent.
                - roots[intent] == roots[predecessor] AND roots[predecessor] != predecessor. 
        */
        bytes32 rootIntentId = s_intentRoots[intentId];
        bytes32 predecessorIntentId = s_intentVersions[intentId];

        if (rootIntentId == intentId && predecessorIntentId == bytes32(0)) {
            return true;
        }

        bytes32 predecessorRootIntentId = s_intentRoots[predecessorIntentId];
        if (predecessorRootIntentId != rootIntentId) {
            revert IntentBook__IntentPredecessorRootDoesNotMatch();
        }
        return true;
    }
}
