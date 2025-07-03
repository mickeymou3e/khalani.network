pragma solidity 0.8.19;

import "./lib/IntentBookLib.sol";

interface IntentBookEvents {
    event IntentCreated(bytes32 indexed intentId, IntentBookLib.Intent intent);

    event IntentMatch(bytes32 indexed intentId, bytes32 indexed intentBidId, IntentBookLib.IntentBid intentBid);

    event IntentSettled(bytes32 indexed intentId, bytes32 indexed intentBidId);

    event IntentPartiallySettled(bytes32 indexed intentId, bytes32 indexed intentBidId);

    event IntentCancelled(bytes32 indexed intentId);
}