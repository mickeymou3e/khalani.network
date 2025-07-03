pragma solidity ^0.8.0;

library IntentBookLib {

    struct Intent {
        bytes intent;
        bytes signature;
    }

    struct IntentBid {
        bytes32 intentId;
        bytes bid;
    }

    function calculateIntentId(Intent memory intent) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                intent.intent,
                intent.signature
            )
        );
    }

    function calculateIntentBidId(IntentBid memory intentBid) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                intentBid.intentId,
                intentBid.bid
            )
        );
    }
}