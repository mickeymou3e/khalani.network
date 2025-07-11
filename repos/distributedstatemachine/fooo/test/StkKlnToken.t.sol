// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.4;

import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";
import "../src/Staking/StkKlnToken.sol";
import "forge-std/Test.sol";

contract StkTokenTest is Test {
    StkKlnToken stkKlnUsdc;
    MockERC20 klnUSDC;

    function setUp() public {
        klnUSDC = new MockERC20("klnUSDC", "klnUSDC", 18);
        stkKlnUsdc = new StkKlnToken(klnUSDC, "stkKlnUsdc", "stkKlnUsdc", 1000);
    }

    /// @dev test totalAssets call before, during, and after a reward distribution that starts on cycle start
    function test_totalAssetsDuringRewardDistribution(uint128 seed, uint128 reward) public {
        uint256 combined = uint256(seed) + uint256(reward);

        unchecked {
            vm.assume(seed != 0 && reward !=0 && combined < type(uint128).max);
        }

        klnUSDC.mint(address(this), combined);
        klnUSDC.approve(address(stkKlnUsdc), combined);

        // first seed pool
        stkKlnUsdc.deposit(seed, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == seed, "seed");

        // mint rewards to pool
        klnUSDC.mint(address(stkKlnUsdc), reward);
        assertTrue(stkKlnUsdc.prevRewardTotal() == 0, "reward");
        assertTrue(stkKlnUsdc.totalAssets() == seed, "totalassets");
        assertTrue(stkKlnUsdc.convertToAssets(seed) == seed); // 1:1 still

        stkKlnUsdc.syncRewards();
        // after sync, everything same except prevRewardTotal
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == seed);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == seed); // 1:1 still

        // // accrue half the rewards
        skip(stkKlnUsdc.maxRewardPeriod()/2);
        uint256 partialRewards = 0;
        if (block.timestamp > stkKlnUsdc.currentRewardPeriodEnd()) {
            partialRewards = reward;
        } else {
            partialRewards = (reward * (block.timestamp - stkKlnUsdc.lastRewardSync())) / (stkKlnUsdc.currentRewardPeriodEnd() - stkKlnUsdc.lastRewardSync());
        }
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == uint256(seed) + partialRewards);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == uint256(seed) + partialRewards); // half rewards added
        assertTrue(stkKlnUsdc.convertToShares(uint256(seed) + partialRewards) == seed); // half rewards added

        // // accrue remaining rewards
        skip(stkKlnUsdc.maxRewardPeriod());
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == combined);
        assertEq(stkKlnUsdc.convertToAssets(seed), combined); // all rewards added
        assertEq(stkKlnUsdc.convertToShares(combined), seed);

        // accrue all and warp ahead 1 cycle
        vm.warp(stkKlnUsdc.maxRewardPeriod()*2);
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == combined);
        assertEq(stkKlnUsdc.convertToAssets(seed), combined); // all rewards added
        assertEq(stkKlnUsdc.convertToShares(combined), seed);
    }

    /// @dev test totalAssets call before, during, and after a reward distribution that starts on cycle start
    function test_totalAssetsDuringDelayedRewardDistribution(uint128 seed, uint128 reward) public {
        uint256 combined = uint256(seed) + uint256(reward);

        unchecked {
            vm.assume(seed != 0 && reward !=0 && combined < type(uint128).max);
        }

        klnUSDC.mint(address(this), combined);
        klnUSDC.approve(address(stkKlnUsdc), combined);

        // first seed pool
        stkKlnUsdc.deposit(seed, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == seed, "seed");

        // mint rewards to pool
        klnUSDC.mint(address(stkKlnUsdc), reward);
        assertTrue(stkKlnUsdc.prevRewardTotal() == 0, "reward");
        assertTrue(stkKlnUsdc.totalAssets() == seed, "totalassets");
        assertTrue(stkKlnUsdc.convertToAssets(seed) == seed); // 1:1 still

        skip(stkKlnUsdc.maxRewardPeriod()/2); //start midway

        stkKlnUsdc.syncRewards();
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward, "reward");
        assertTrue(stkKlnUsdc.totalAssets() == seed, "totalassets");
        assertTrue(stkKlnUsdc.convertToAssets(seed) == seed); // 1:1 still

        // accrue half the rewards
        uint256 halfOfRemainingCycle = (stkKlnUsdc.maxRewardPeriod() - block.timestamp) / 2;
        skip(halfOfRemainingCycle);
        uint256 partialRewards = (stkKlnUsdc.prevRewardTotal() * (block.timestamp - stkKlnUsdc.lastRewardSync())) / (stkKlnUsdc.currentRewardPeriodEnd() - stkKlnUsdc.lastRewardSync());
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == uint256(seed) + partialRewards);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == uint256(seed) + partialRewards); // half rewards added

        // accrue remaining rewards
        skip(halfOfRemainingCycle+1);
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == combined);
        assertEq(stkKlnUsdc.convertToAssets(seed), combined); // all rewards added
        assertEq(stkKlnUsdc.convertToShares(combined), seed);

        // accrue all and warp ahead 1 cycle
        skip(stkKlnUsdc.maxRewardPeriod());
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == combined);
        assertEq(stkKlnUsdc.convertToAssets(seed), combined); // all rewards added
        assertEq(stkKlnUsdc.convertToShares(combined), seed);
    }

    function test_totalAssetsAfterDeposit(uint128 deposit1, uint128 deposit2) public {
        vm.assume(deposit1 != 0 && deposit2 !=0);

        uint256 combined = uint256(deposit1) + uint256(deposit2);
        klnUSDC.mint(address(this), combined);
        klnUSDC.approve(address(stkKlnUsdc), combined);
        stkKlnUsdc.deposit(deposit1, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == deposit1);

        stkKlnUsdc.deposit(deposit2, address(this));
        assertEq(stkKlnUsdc.totalAssets(), combined);
    }

    function test_totalAssetsAfterWithdraw(uint128 deposit, uint128 withdraw) public {

        vm.assume(deposit != 0 && withdraw != 0 && withdraw <= deposit);

        klnUSDC.mint(address(this), deposit);
        klnUSDC.approve(address(stkKlnUsdc), deposit);

        stkKlnUsdc.deposit(deposit, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == deposit);

        stkKlnUsdc.withdraw(withdraw, address(this), address(this));
        assertTrue(stkKlnUsdc.totalAssets() == deposit - withdraw);
    }

    function test_syncRewardsFailsDuringCycle(uint128 seed, uint128 reward, uint256 warp) public {
        uint256 combined = uint256(seed) + uint256(reward);

        unchecked {
            vm.assume(seed != 0 && reward !=0 && combined < type(uint128).max);
        }

        klnUSDC.mint(address(this), seed);
        klnUSDC.approve(address(stkKlnUsdc), seed);

        stkKlnUsdc.deposit(seed, address(this));
        klnUSDC.mint(address(stkKlnUsdc), reward);
        stkKlnUsdc.syncRewards();
        warp = bound(warp, 0, 999);
        vm.warp(warp);

        vm.expectRevert(abi.encodeWithSignature("SyncError()"));
        stkKlnUsdc.syncRewards();
    }

    function test_syncRewardsAfterEmptyCycle(uint128 seed, uint128 reward) public {
        uint256 combined = uint256(seed) + uint256(reward);

        unchecked {
            vm.assume(seed != 0 && reward !=0 && combined < type(uint128).max);
        }

        klnUSDC.mint(address(this), seed);
        klnUSDC.approve(address(stkKlnUsdc), seed);

        stkKlnUsdc.deposit(seed, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == seed, "seed");
        skip(stkKlnUsdc.maxRewardPeriod()/10);

        // sync with no new rewards
        stkKlnUsdc.syncRewards();
        assertTrue(stkKlnUsdc.prevRewardTotal() == 0);
        assertTrue(stkKlnUsdc.lastRewardSync() == block.timestamp);
        assertTrue(stkKlnUsdc.totalAssets() == seed);
        assertTrue(stkKlnUsdc.convertToShares(seed) == seed);

        // fast forward to next cycle and add rewards
        skip(stkKlnUsdc.maxRewardPeriod());
        klnUSDC.mint(address(stkKlnUsdc), reward); // seed new rewards

        stkKlnUsdc.syncRewards();
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == seed);
        assertTrue(stkKlnUsdc.convertToShares(seed) == seed);

        skip(stkKlnUsdc.maxRewardPeriod()*2);

        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.totalAssets() == combined);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == combined);
        assertEq(stkKlnUsdc.convertToShares(combined), seed);
    }

    function test_syncRewardsAfterFullCycle(uint128 seed, uint128 reward, uint128 reward2) public {
        uint256 combined1 = uint256(seed) + uint256(reward);
        uint256 combined2 = uint256(seed) + uint256(reward) + reward2;

        unchecked {
            vm.assume(seed != 0 && reward !=0 && reward2 != 0 && combined2 < type(uint128).max);
        }

        klnUSDC.mint(address(this), seed);
        klnUSDC.approve(address(stkKlnUsdc), seed);

        stkKlnUsdc.deposit(seed, address(this));
        assertTrue(stkKlnUsdc.totalAssets() == seed, "seed");
        skip(stkKlnUsdc.maxRewardPeriod()/10);

        klnUSDC.mint(address(stkKlnUsdc), reward); // seed new rewards
        // sync with new rewards
        stkKlnUsdc.syncRewards();
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward);
        assertTrue(stkKlnUsdc.lastRewardSync() == block.timestamp);
        assertTrue(stkKlnUsdc.totalAssets() == seed);
        assertTrue(stkKlnUsdc.convertToShares(seed) == seed); // 1:1 still

        // // fast forward to next cycle and add rewards
        skip(stkKlnUsdc.maxRewardPeriod());
        klnUSDC.mint(address(stkKlnUsdc), reward2); // seed new rewards

        stkKlnUsdc.syncRewards();
        assertTrue(stkKlnUsdc.prevRewardTotal() == reward2);
        assertTrue(stkKlnUsdc.totalAssets() == combined1);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == combined1);

        vm.warp(stkKlnUsdc.maxRewardPeriod()*2);

        assertTrue(stkKlnUsdc.prevRewardTotal() == reward2);
        assertTrue(stkKlnUsdc.totalAssets() == combined2);
        assertTrue(stkKlnUsdc.convertToAssets(seed) == combined2);
    }
}