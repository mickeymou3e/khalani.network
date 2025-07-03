pragma solidity ^0.8.4;

import {SpokeChainAssetRegistry} from "./SpokeChainAssetRegistry.sol";
import "../../Intents/proof/EventProver.sol";
import "../../Intents/proof/EventVerifier.sol";
import "../../Intents/libraries/TokenEventLibrary.sol";
import {SlowBridgeIntentValidator} from "../SlowBridgeIntentValidator.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../SlowBridgeIntentsLibrary.sol";

//Slow Bridge Mechanism ?
contract AssetReserves is SpokeChainAssetRegistry, SlowBridgeIntentValidator {
    using SafeERC20 for IERC20;

    EventProver public eventProver;
    EventVerifier public eventVerifier;
    uint256 public nonce;

    constructor(EventProver _eventProver, EventVerifier _eventVerifier) {
        eventProver = _eventProver;
        eventVerifier = _eventVerifier;
    }

    //function to lock "amount" tokens of "asset" in the contract by transferring "amount" tokens to the contract
    function lockAsset(address receiver, address asset, uint256 amount) external {

        _lockAsset(asset, amount);

        //create intent id
        bytes32 intentId = SlowBridgeIntentsLibrary.calculateLockTokenIntentId(
            nonce,
            block.chainid,
            msg.sender,
            asset,
            amount,
            receiver
        );

        //register the event
        bytes32 eventHash = TokenEventLibrary.calculateLockTokenEventHash(
            TokenEventLibrary.LockTokenEvent(
                intentId
            )
        );

        eventProver.registerEvent(eventHash);

        //emit the event
        emit TokenEventLibrary.LockToken(
            intentId,
            nonce,
            asset,
            amount
        );

        //increment nonce
        nonce++;
    }

    //function to unlock "amount" tokens of "asset" from the contract by increasing the allowance of the contract to "amount"
    function unlockAsset(uint intentNonce, address author, address receiver, address asset, uint256 amount) external {
        //verify if intent is settled, settled intent should not be processed again

        bytes32 intentId = SlowBridgeIntentsLibrary.calculateUnlockTokenIntentId(
            intentNonce,
            block.chainid,
            author,
            asset,
            amount,
            receiver
        );

        require(!isSettled(intentId), "AssetReserves: Intent already settled");

        //mark it as settled
        _markIntentSettled(intentId);

        //verify token unlock event
        bytes32 eventHash = TokenEventLibrary.calculateUnlockTokenEventHash(
            TokenEventLibrary.UnlockTokenEvent(
                intentId
            )
        );

        require(eventVerifier.verify(eventHash), "AssetReserves: Invalid event");

        //unlock the asset
        _unlockAsset(asset, amount, receiver);
    }

    //internal function to unlock "amount" tokens of "asset" from the contract by increasing the allowance of the contract to "amount"
    function _unlockAsset(address asset, uint256 amount, address receiver) internal {
        require(asset != address(0), "AssetReserves: Invalid asset address");
        require(assetWhiteList[asset], "AssetReserves: Asset not whitelisted");
        require(amount > 0, "AssetReserves: Invalid amount");
        IERC20(asset).safeIncreaseAllowance(receiver, amount);
    }

    //internal function to lock "amount" tokens of "asset" in the contract by transferring "amount" tokens to the contract
    function _lockAsset(address asset, uint256 amount) internal {
        require(asset != address(0), "AssetReserves: Invalid asset address");
        require(assetWhiteList[asset], "AssetReserves: Asset not whitelisted");
        require(amount > 0, "AssetReserves: Invalid amount");
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
    }
}