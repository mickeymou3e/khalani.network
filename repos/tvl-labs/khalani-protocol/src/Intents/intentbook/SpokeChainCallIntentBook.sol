pragma solidity ^0.8.4;

import {SpokeChainCallIntentLib} from "./lib/SpokeChainCallIntentLib.sol";
import {SpokeChainCallEventLibrary} from "../libraries/SpokeChainCallEventLibrary.sol";
import "./BaseIntentBook.sol";
import "../registry/VerifierRegistry.sol";
import "../interfaces/IRewarder.sol";
import {IntentBookEscrow} from "./IntentBookEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SpokeChainCallIntentBook is BaseIntentBook, IntentBookEscrow {

    VerifierRegistry public verifierRegistry;

    constructor(VerifierRegistry _verifierRegistry) {
        verifierRegistry = _verifierRegistry;
    }

    function _placeIntent(bytes32 intentId) internal override {
        IntentBookLib.Intent memory intent = intentData[intentId];
        SpokeChainCallIntentLib.SpokeChainCall memory swapIntentOrder = abi.decode(intent.intent, (SpokeChainCallIntentLib.SpokeChainCall));
        // Lock reward from author
        if (swapIntentOrder.rewardAmount > 0){
            _deposit(ERC20(swapIntentOrder.rewardToken), swapIntentOrder.rewardAmount, swapIntentOrder.author);
        }
    }

    function _matchIntent(bytes32, bytes32 intentBidId) internal override {
        // Currently no op. In future, we will lock bond here.
    }

    function _verifySignature(bytes32 intentId) internal override {
        IntentBookLib.Intent memory intent = intentData[intentId];
        SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCall = abi.decode(intent.intent, (SpokeChainCallIntentLib.SpokeChainCall));
        bytes32 intentHash = SpokeChainCallIntentLib._getIntentHash(spokeChainCall);
        _verifyMetaTransactionSignature(intent.signature, intentHash, spokeChainCall.author);
        _replayProtection(spokeChainCall.author, spokeChainCall.nonceIndex, spokeChainCall.nonceBitToFlip);
    }

    function verifySignature(bytes memory signature, SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCall) public {
        bytes32 intentHash = SpokeChainCallIntentLib._getIntentHash(spokeChainCall);
        _verifyMetaTransactionSignature(signature, intentHash, spokeChainCall.author);
    }

    function verifyBid(SpokeChainCallIntentLib.SpokeChainCallBid memory spokeChainCallBid) public view {
        // It is here only to make `forge bind` generate a struct binding for `SpokeChainCallBid`.
    }

    function _settleIntent(bytes32 intentId, bytes32 intentBidId) internal override returns (bool) {
        IntentBookLib.Intent memory intent = intentData[intentId];
        SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCall = abi.decode(intent.intent, (SpokeChainCallIntentLib.SpokeChainCall));

        IntentBookLib.IntentBid memory intentBid = intentBidData[intentBidId];
        SpokeChainCallIntentLib.SpokeChainCallBid memory spokeChainCallBid = abi.decode(intentBid.bid, (SpokeChainCallIntentLib.SpokeChainCallBid));

        bytes32 eventHash = SpokeChainCallEventLibrary.calculateSpokeCalledEventHash(SpokeChainCallEventLibrary.SpokeCalled({
            caller: spokeChainCallBid.caller,
            spokeChainCallIntentId: intentId,
            contractToCall: spokeChainCall.contractToCall,
            callData: spokeChainCall.callData,
            token: spokeChainCall.token,
            amount: spokeChainCall.amount
        }));
        EventVerifier verifier = verifierRegistry.proofVerifierForChain(spokeChainCall.chainId);
        require(verifier.verify(eventHash), "SpokeChainCallIntentBook: Invalid intent");

        //release reward caller
        if(spokeChainCall.rewardAmount > 0){
            _withdraw(ERC20(spokeChainCall.rewardToken), spokeChainCall.rewardAmount, spokeChainCallBid.caller);
        }

        return true; // Fully settled.
    }
}