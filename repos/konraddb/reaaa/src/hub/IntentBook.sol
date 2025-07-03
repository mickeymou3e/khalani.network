// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IntentLib} from "../libraries/IntentLib.sol";
import {SignatureLib} from "../libraries/SignatureLib.sol";
import {SolutionLib} from "../libraries/SolutionLib.sol";
import {MTokenManager} from "./MTokenManager.sol";
import {ReceiptManager} from "./ReceiptManager.sol";
import "../types/Intent.sol";
import "../types/Receipt.sol";
import "../types/Solution.sol";
import "../types/Events.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    error IntentBook__CannotCancelNonOpenIntent();
    error IntentBook__UnauthorizedCancellationAttempt();
    error IntentBook__InvalidSignature();
    error IntentBook__InvalidIntentAuthor();
    error IntentBook__IntentNotSpendable(bytes32 intentId);
    error IntentBook__IntentNotFound(bytes32 intentId);
    error IntentBook__CannotSpendIntentThatIsNotOpen(bytes32 intentId);
    error IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
    error IntentBook__IntentVersionsCannotChangeTtlWhenSpent();

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

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    uint256 private s_nonce;
    mapping(address user => uint256 nonce) private s_userNonces;
    mapping(address solver => bool authorized) private s_solvers;
    mapping(address publisher => bool authorized) private s_intentPublishers;
    mapping(address author => bytes32[] intentIds) private s_userIntents;
    mapping(bytes32 intentId => SignedIntent) private s_intents;
    mapping(bytes32 intentId => IntentState) private s_intentStates;
    mapping(bytes32 childIntentId => bytes32 parentIntentId) private s_intentVersions;
    address private s_mTokenManager;
    address private s_receiptManager;
    address private s_solutionLib;

    constructor(address solutionLib) Ownable() {
        s_solutionLib = solutionLib;
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

    function getNonce(address _user) public view returns (uint256) {
        return s_userNonces[_user];
    }

    function getNonce() public view returns (uint256) {
        return s_userNonces[msg.sender];
    }

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

    function isSolver(address solver) public view returns (bool) {
        return s_solvers[solver];
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

        if (!SignatureLib.verifyIntentSignature(signedIntent, address(this))) {
            revert IntentBook__InvalidSignature();
        }

        bytes32 intentId = getIntentId(intent);
        if (s_intentStates[intentId] != IntentState.NonExistent) {
            revert IntentBook__IntentAlreadyExists(intentId);
        }

        MTokenManager(s_mTokenManager).transferMTokensToIntent(
            intent.author, intentId, intent.srcMToken, intent.srcAmount, signedIntent
        );

        setNonce(signedIntent.intent.author, signedIntent.intent.nonce);
        s_intents[intentId] = signedIntent;
        s_intentStates[intentId] = IntentState.Open;
        s_userIntents[intent.author].push(intentId);

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

        return intentId;
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
            // if (!checkIntentValidToSpend(currIntent)) {
            //     revert IntentBook__IntentNotSpendable(intentId);
            // }
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

        SolutionLib(s_solutionLib).verifySolutionInvariants(
            consumedIntents, outputIntents, outputReceipts, spendGraph, fillGraph
        );
        SolutionLib(s_solutionLib).checkIntentSatisfaction(consumedIntents, outputIntents, outputReceipts, fillGraph);

        bytes32[] memory intentChainRoots = new bytes32[](consumedIntents.length);
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            bytes32 intentId = getIntentId(consumedIntents[i]);
            intentChainRoots[i] = getIntentChainRoot(intentId);
        }

        if (outputReceipts.length > 0) {
            issueReceiptsAndTransferMTokens(
                s_receiptManager, s_mTokenManager, outputReceipts, consumedIntents, spendGraph, intentChainRoots
            );
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
                if (outputIntentId == spentIntentId) {
                    revert IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
                }
                if (spentIntent.ttl != createdIntent.ttl) {
                    revert IntentBook__IntentVersionsCannotChangeTtlWhenSpent();
                }
                if (spentIntent.srcAmount == createdIntent.srcAmount) {
                    revert IntentBook__SpendingPartiallyFillableIntentMustMakeProgress();
                }
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
                    createdIntent.outcome.mAmounts,
                    createdIntent.outcome.outcomeAssetStructure,
                    createdIntent.outcome.fillStructure
                );
            }
        }
    }

    function getIntentId(Intent memory intent) public view returns (bytes32) {
        return IntentLib.hashIntent(intent);
    }

    function getIntentChainRoot(bytes32 intentId) public view returns (bytes32) {
        bytes32 currIntentId = intentId;
        while (s_intentVersions[currIntentId] != bytes32(0)) {
            currIntentId = s_intentVersions[currIntentId];
        }
        return currIntentId;
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
        return true;
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

    function issueReceiptsAndTransferMTokens(
        address s_receiptManager,
        address s_mTokenManager,
        Receipt[] memory outputReceipts,
        Intent[] memory consumedIntents,
        MoveRecord[] memory spendGraph,
        bytes32[] memory intentChainRoots
    ) internal {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            if (moveRec.outputIdx.outType == OutType.Receipt) {
                uint256 sourceIntentIdx = moveRec.srcIdx;
                uint256 outReceiptIdx = moveRec.outputIdx.outIdx;
                Receipt memory receipt = outputReceipts[outReceiptIdx];
                Intent memory intent = consumedIntents[sourceIntentIdx];
                bytes32 intentId = IntentLib.hashIntent(intent);
                bytes32 intentChainRoot = intentChainRoots[sourceIntentIdx];

                bytes32 receiptId = ReceiptManager(s_receiptManager).createReceipt(
                    receipt.owner, receipt.mToken, receipt.mTokenAmount, intentId
                );

                MTokenManager(s_mTokenManager).transferMTokensToReceipt(
                    intentChainRoot, receiptId, intent.srcMToken, receipt.mTokenAmount
                );
            }
        }
    }
}
