pragma solidity ^0.8.4;

import {IntentBookLib} from "./lib/IntentBookLib.sol";
import "./lib/SwapIntentLib.sol";
import "./BaseIntentBook.sol";
import "../registry/VerifierRegistry.sol";
import "../interfaces/IRewarder.sol";
import "../libraries/SwapIntentEventLibrary.sol";
import "./lib/IntentBookLib.sol";

contract SwapIntentBook is BaseIntentBook {

    VerifierRegistry verifierRegistry;
    IRewarder rewarder;

    constructor(
        VerifierRegistry _verifierRegistry,
        IRewarder _rewarder
    ) {
        verifierRegistry = _verifierRegistry;
        rewarder = _rewarder;
    }

    function _placeIntent(bytes32 intentId) internal override {
        // No op.
    }

    function _matchIntent(bytes32 intentId, bytes32 intentBidId) internal override {
        // Currently, no op. In future, we will lock bond here.
    }

    function _verifySignature(bytes32 intentId) internal override {
        IntentBookLib.Intent memory intent = intentData[intentId];
        SwapIntentLib.SwapIntent memory swapIntentOrder = abi.decode(intent.intent, (SwapIntentLib.SwapIntent));
        bytes32 intentHash = SwapIntentLib._getIntentHash(swapIntentOrder);
        _verifyMetaTransactionSignature(intent.signature, intentHash, swapIntentOrder.author);
        _replayProtection(swapIntentOrder.author, swapIntentOrder.nonceIndex, swapIntentOrder.nonceBitToFlip);
    }

    function verifySignature(bytes memory signature, SwapIntentLib.SwapIntent memory swapIntentOrder) public {
        bytes32 intentHash = SwapIntentLib._getIntentHash(swapIntentOrder);
        _verifyMetaTransactionSignature(signature, intentHash, swapIntentOrder.author);
    }

    function verify(SwapIntentLib.SwapIntentBid memory swapIntentBid) public view {
        // It is here only to make `forge bind` generate a struct binding for `SwapIntentBid`.
    }

    function _settleIntent(bytes32 intentId, bytes32 intentBidId) internal override returns (bool) {
        IntentBookLib.Intent memory intent = intentData[intentId];
        SwapIntentLib.SwapIntent memory swapIntent = abi.decode(intent.intent, (SwapIntentLib.SwapIntent));

        IntentBookLib.IntentBid memory intentBid = intentBidData[intentBidId];
        SwapIntentLib.SwapIntentBid memory swapIntentBid = abi.decode(intentBid.bid, (SwapIntentLib.SwapIntentBid));

        bytes32 swapIntentId = SwapIntentLib.calculateSwapIntentId(swapIntent);
        require(
            verifierRegistry.proofVerifierForChain(
                swapIntent.sourceChainId
            ).verify(
                _constructTokenLockedEventHash(
                    swapIntentId
                )
            ),
            "token not locked at source"
        );

        //construct intent fulfilled event
        //check for proof of swap fulfilled
        require(
            verifierRegistry.proofVerifierForChain(
                swapIntent.destinationChainId
            ).verify(
                _constructSwapIntentFilledEventHash(
                    swapIntentId,
                    swapIntentBid.filler,
                    swapIntentBid.fillAmount
                )
            ),
            "swap not fulfilled at destination"
        );

        //reward filler with `amount` of mirror tokens to solver
        rewarder.reward(
            swapIntent.sourceChainId,
            swapIntent.sourceToken,
            swapIntent.sourceAmount,
            swapIntentBid.filler
        );

        return true; // Fully settled.
    }

    function _constructTokenLockedEventHash(bytes32 intentId) private pure returns (bytes32) {
        return SwapIntentEventLibrary.calculateSwapIntentTokenLockEventHash(
            SwapIntentEventLibrary.SwapIntentTokenLock(intentId)
        );
    }

    function _constructSwapIntentFilledEventHash(bytes32 intentId, address filler, uint256 fillAmount) private pure returns(bytes32) {
        return SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(
            SwapIntentEventLibrary.SwapIntentFilled(
                intentId,
                filler,
                fillAmount
            )
        );
    }

    function _calculateSwapIntentId(SwapIntentLib.SwapIntent memory swapIntentOrder) internal pure returns (bytes32) {
        return SwapIntentLib.calculateSwapIntentId(
            SwapIntentLib.SwapIntent(
                swapIntentOrder.author,
                swapIntentOrder.sourceChainId,
                swapIntentOrder.destinationChainId,
                swapIntentOrder.sourceToken,
                swapIntentOrder.destinationToken,
                swapIntentOrder.sourceAmount,
                swapIntentOrder.sourcePermit2,
                swapIntentOrder.deadline,
                swapIntentOrder.nonceIndex,
                swapIntentOrder.nonceBitToFlip
            )
        );
    }
}