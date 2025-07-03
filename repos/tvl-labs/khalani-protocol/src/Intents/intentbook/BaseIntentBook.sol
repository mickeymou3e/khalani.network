pragma solidity 0.8.19;

import "./IntentBookEvents.sol";
import  "./lib/IntentBookLib.sol";
import {BitFlipMetaTransaction} from "../../MetaTransaction/BitFlipMetaTransaction.sol";

abstract contract BaseIntentBook is BitFlipMetaTransaction, IntentBookEvents {

    enum IntentStatus {
        NOT_EXISTS,
        NEW,
        SETTLED,
        CANCELLED
    }

    struct IntentState {
        IntentStatus status;
        bytes32 intentBidId;
    }

    mapping(bytes32 => IntentState) public intentStates;
    mapping(bytes32 => IntentBookLib.Intent) public intentData;
    mapping(bytes32 => IntentBookLib.IntentBid) public intentBidData;

    function placeIntent(IntentBookLib.Intent calldata intent) public returns (bytes32 intentId) {
        intentId = IntentBookLib.calculateIntentId(intent);

        require(intentStates[intentId].status == IntentStatus.NOT_EXISTS, "Intent already exists");
        intentStates[intentId] = IntentState(IntentStatus.NEW, bytes32(0));
        intentData[intentId] = intent;
        _placeIntent(intentId);

        //validate signature
        _verifySignature(intentId);

        emit IntentCreated(intentId, intent);
    }

    function placeBatchIntent(IntentBookLib.Intent[] calldata intents) external returns (bytes32[] memory intentIds) {
        intentIds = new bytes32[](intents.length);
        for (uint i = 0; i < intents.length; i++) {
            intentIds[i] = placeIntent(intents[i]);
        }
    }

    function matchIntent(IntentBookLib.IntentBid calldata intentBid) public {
        bytes32 intentId = intentBid.intentId;
        IntentState storage intentState = intentStates[intentId];
        require(intentState.intentBidId == bytes32(0), "Intent already has a bid");

        require(intentState.status != IntentStatus.NOT_EXISTS, "Intent does not exist");
        require(intentState.status != IntentStatus.CANCELLED, "Intent is already cancelled");
        require(intentState.status != IntentStatus.SETTLED, "Intent is already settled");

        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);
        require(intentBidData[intentBidId].intentId == bytes32(0), "Bid already exists");
        intentBidData[intentBidId] = intentBid;

        intentState.intentBidId = intentBidId;

        _matchIntent(intentId, intentBidId);

        emit IntentMatch(intentId, intentBidId, intentBid);
    }

    function settleIntent(bytes32 intentId) public {
        IntentState storage intentState = intentStates[intentId];
        bytes32 intentBidId = intentState.intentBidId;
        require(intentBidId != bytes32(0), "Intent does not have a bid");

        bool fullySettled = _settleIntent(intentId, intentBidId);

        // Remove the current bid.
        intentState.intentBidId = bytes32(0);
        delete intentBidData[intentBidId];

        if (fullySettled) {
            intentState.status = IntentStatus.SETTLED;
            emit IntentSettled(intentId, intentBidId);
        } else {
            emit IntentPartiallySettled(intentId, intentBidId);
        }
    }

    function matchAndSettle(IntentBookLib.IntentBid calldata intentBid) public {
        matchIntent(intentBid);
        settleIntent(intentBid.intentId);
    }

    function cancelIntent(bytes32 intentId) public {
        IntentState storage intent = intentStates[intentId];
        require(intent.status != IntentStatus.SETTLED, "Intent is already settled");
        require(intent.status != IntentStatus.CANCELLED, "Intent is already cancelled");

        intent.status = IntentStatus.CANCELLED;
        emit IntentCancelled(intentId);
    }

    function cancelBatchIntent(bytes32[] calldata intentIds) external {
        for (uint i = 0; i < intentIds.length; i++) {
            cancelIntent(intentIds[i]);
        }
    }

    function _placeIntent(bytes32 intentId) internal virtual ;
    function _matchIntent(bytes32 intentId, bytes32 intentBidId) internal virtual;
    function _verifySignature(bytes32 intentId) internal virtual;
    function _settleIntent(bytes32 intentId, bytes32 intentBidId) internal virtual returns (bool);
}