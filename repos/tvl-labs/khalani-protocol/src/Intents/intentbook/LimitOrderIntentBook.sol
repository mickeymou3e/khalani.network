pragma solidity ^0.8.4;

import "./BaseIntentBook.sol";
import "./lib/LimitOrderIntentLib.sol";
import "./lib/IntentBookLib.sol";
import "./IntentBookEscrow.sol";

contract LimitOrderIntentBook is BaseIntentBook, IntentBookEscrow {

    event LimitOrderFulfilled(bytes32 intentId);
    event LimitOrderPartialFill(bytes32 intentId, uint256 volumeFilled);
    error NotImplemented();

    function _placeIntent(bytes32 intentId) internal override {
        IntentBookLib.Intent storage intent = intentData[intentId];
        LimitOrderIntentLib.LimitOrder memory limitOrder = abi.decode(intent.intent, (LimitOrderIntentLib.LimitOrder));
        _deposit(ERC20(limitOrder.token), limitOrder.volume, limitOrder.author);
    }

    function _matchIntent(bytes32 intentId, bytes32 intentBidId) internal override {
        // No op.
    }

    function _settleIntent(bytes32 intentId, bytes32 intentBidId) internal override returns (bool) {
        IntentBookLib.Intent storage intent = intentData[intentId];
        LimitOrderIntentLib.LimitOrder memory limitOrder = abi.decode(intent.intent, (LimitOrderIntentLib.LimitOrder));

        IntentBookLib.IntentBid memory intentBid = intentBidData[intentBidId];
        LimitOrderIntentLib.LimitOrderBid memory limitOrderBid = abi.decode(intentBid.bid, (LimitOrderIntentLib.LimitOrderBid));

        // Get decimals for each token
        uint256 tokenDecimals = ERC20(limitOrder.token).decimals();
        uint256 outTokenDecimals = ERC20(limitOrder.outToken).decimals();

        // The volume here is assumed to be already represented in the correct decimal format
        uint256 volume = limitOrder.volume;
        uint256 price = limitOrder.price;

        // Adjust price for outToken decimals
        uint256 adjustedPrice = price * (10**outTokenDecimals) / 1e18;

        // Send tokens from filler to author
        // The value sent is volume * price, adjusted for outToken's decimal count
        ERC20(limitOrder.outToken).transferFrom(msg.sender, limitOrder.author, volume * adjustedPrice / (10**tokenDecimals));

        // Send tokens from author to filler
        // The value sent is just the volume, as it's already in the correct decimal format
        _withdraw(ERC20(limitOrder.token), volume, msg.sender);

        limitOrder.volume -= limitOrderBid.volume;

        bool isFullySettled = limitOrder.volume == 0;
        if (isFullySettled) {
            emit LimitOrderFulfilled(intentId);
        } else {
            emit LimitOrderPartialFill(intentId, limitOrderBid.volume);
        }
        return isFullySettled;
    }

    function _verifySignature(bytes32 intentId) internal override {
        IntentBookLib.Intent storage intent = intentData[intentId];
        LimitOrderIntentLib.LimitOrder memory limitOrder = abi.decode(intent.intent, (LimitOrderIntentLib.LimitOrder));
        bytes32 intentHash = LimitOrderIntentLib._getIntentHash(limitOrder);
        _verifyMetaTransactionSignature(intent.signature, intentHash, limitOrder.author);
        _replayProtection(limitOrder.author, limitOrder.nonceIndex, limitOrder.nonceBitToFlip);
    }

    function verifySignature(bytes memory signature, LimitOrderIntentLib.LimitOrder memory limitOrder) public {
        bytes32 intentHash = LimitOrderIntentLib._getIntentHash(limitOrder);
        _verifyMetaTransactionSignature(signature, intentHash, limitOrder.author);
    }

    function verify(LimitOrderIntentLib.LimitOrderBid memory limitOrderBid) public view {
        // It is here only to make `forge bind` generate a struct binding for `LimitOrderBid`.
    }
}