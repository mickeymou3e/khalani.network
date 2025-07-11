// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "solmate/mixins/ERC4626.sol";
import "solmate/utils/SafeCastLib.sol";

/**
 @title  Single Staking Contract
 @notice This contract enables users to automatically reinvest their rewards, which are given in a specific reward token.
 The contract functions in "cycles," during which any rewards that exceed the internal balance are distributed evenly to users for the remaining duration of that cycle.
*/
contract StkKlnToken is ERC4626 {
    using SafeCastLib for *;

    /// @notice the maximum duration of a rewards period
    uint32 public immutable maxRewardPeriod;

    /// @notice the timestamp when the current rewards period began
    uint32 public lastRewardSync;

    /// @notice the timestamp when the current rewards period will end, always a multiple of `maxRewardPeriod`
    uint32 public currentRewardPeriodEnd;

    /// @notice the total rewards distributed in the most recent rewards period
    uint192 public prevRewardTotal;

    /// @notice total stored assets internally
    uint256 internal totalAssetsStored;

    error SyncError();
    event RewardCycleUpdated(uint32 indexed cycleEnd, uint256 rewardAmount);
    constructor(ERC20 _underlying, string memory _name, string memory _symbol, uint32 _maxRewardPeriod) ERC4626(_underlying, _name, _symbol) {
        maxRewardPeriod = _maxRewardPeriod;
        // Seed initial currentRewardPeriodEnd
        currentRewardPeriodEnd = (block.timestamp.safeCastTo32() / maxRewardPeriod) * maxRewardPeriod;
    }

    /// @notice Compute the amount of tokens available to shareholders.
    ///         Increases linearly during a reward distribution period from the sync call, not the cycle start.
    function totalAssets() public view override returns (uint256) {
        // Cache global vars
        uint256 totalAssetsStored_ = totalAssetsStored;
        uint192 prevRewardTotal_ = prevRewardTotal;
        uint32 currentRewardPeriodEnd_ = currentRewardPeriodEnd;
        uint32 lastRewardSync_ = lastRewardSync;

        if (block.timestamp >= currentRewardPeriodEnd_) {
            // No rewards or rewards fully unlocked
            // Entire reward amount is available
            return totalAssetsStored_ + prevRewardTotal_;
        }

        // Rewards not fully unlocked
        // Add unlocked rewards to stored total
        uint256 unlockedRewards = (prevRewardTotal_ * (block.timestamp - lastRewardSync_)) / (currentRewardPeriodEnd_ - lastRewardSync_);
        return totalAssetsStored_ + unlockedRewards;
    }

    // Update totalAssetsStored on withdraw/redeem
    function beforeWithdraw(uint256 amount, uint256 shares) internal override {
        super.beforeWithdraw(amount, shares);
        totalAssetsStored -= amount;
    }

    // Update totalAssetsStored on deposit/mint
    function afterDeposit(uint256 amount, uint256 shares) internal override {
        totalAssetsStored += amount;
        super.afterDeposit(amount, shares);
    }

    /// @notice Distributes rewards to stkKlnToken holders.
    /// All surplus `asset` balance of the contract over the internal balance becomes queued for the next cycle.
    function syncRewards() public {
        uint192 prevRewardTotal_ = prevRewardTotal;
        uint32 timestamp = block.timestamp.safeCastTo32();

        if (timestamp < currentRewardPeriodEnd) revert SyncError();

        uint256 totalAssetsStored_ = totalAssetsStored;
        uint256 nextRewards = asset.balanceOf(address(this)) - totalAssetsStored_ - prevRewardTotal_;

        totalAssetsStored = totalAssetsStored_ + prevRewardTotal_;

        uint32 end = ((timestamp + maxRewardPeriod) / maxRewardPeriod) * maxRewardPeriod;

        prevRewardTotal = nextRewards.safeCastTo192();
        lastRewardSync = timestamp;
        currentRewardPeriodEnd = end;

        emit RewardCycleUpdated(end, nextRewards);
    }
}