pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
import "./Mock/MockStrategy.sol";

contract BaseStrategyTest is Test {
    ERC20Mock public asset;
    MockStrategy strategy;
    MockYieldSource public yieldSource;
    address keeper;
    uint256 decimals = 18;
    uint256 MAX_BPS = 10_000;
    uint256 wad = 10**decimals;

    uint256 public maxFuzzAmount = 1e30;
    uint256 public minFuzzAmount = 10_000;
    uint256 public profitMaxUnlockTime = 7 days;

    function setUp() public {
        asset = new ERC20Mock();
        yieldSource = new MockYieldSource(address(asset));
        strategy = new MockStrategy(asset, address(yieldSource));
        //label addresses for better debugging
        vm.label(address (asset), "asset");
        vm.label(address (yieldSource), "yieldSource");
        vm.label(address (strategy), "strategy");
        keeper = address(this);
    }

    //---------------ACCOUNTING TESTS------------------//
    function test_earningYeildDoesNotIncreasePPS(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );

        //no activity withing strategy PPS should be 1.
        uint256 pricePerShare = strategy.pricePerShare();
        assertEq(pricePerShare, wad);

        //deposit into the vault
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        //should still be 1
        assertEq(strategy.pricePerShare(), pricePerShare);

        //lets say some profit it made
        uint256 profit = (_amount * _profitFactor) / MAX_BPS;
        asset.mint(address(yieldSource), profit);

        //nothing should change
        assertEq(strategy.pricePerShare(), pricePerShare);
        assertEq(strategy.totalDebt(), _amount);
        assertEq(strategy.totalIdle(), 0);

        uint beforeBalance = asset.balanceOf(address(_address));
        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        //should have pulled out just the deposited _amount
        assertEq(asset.balanceOf(address(_address)), beforeBalance + _amount);
        assertEq(strategy.totalDebt(), 0);
        assertEq(strategy.totalIdle(), 0);
        console.log("failing here");
        assertEq(asset.balanceOf(address(yieldSource)), profit);
    }

    function test_earningYieldDoesNotIncreasePPS_reportRecordsIt(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );
        uint256 pricePerShare = strategy.pricePerShare();
        assertEq(pricePerShare, wad);

        //deposit into the vault
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        //should still be 1
        assertEq(strategy.pricePerShare(), pricePerShare);

        //lets say some profit it made
        uint256 profit = (_amount * _profitFactor) / MAX_BPS;
        asset.mint(address(yieldSource), profit);

        //nothing should change
        assertEq(strategy.pricePerShare(), pricePerShare);
        assertEq(strategy.totalDebt(), _amount);
        assertEq(strategy.totalIdle(), 0);

        //process report oto realise the gains from profit
        uint256 profitReported;
        (profitReported, ) = strategy.report();

        assertEq(strategy.pricePerShare(), pricePerShare);
        assertEq(profitReported, profit);
        assertEq(strategy.totalDebt(), _amount+profitReported);
        assertEq(strategy.totalIdle(), 0);

        //after some time profit gets unlocked
        skip(profitMaxUnlockTime/2);

        assertGt(strategy.pricePerShare(), pricePerShare);

        //lets say more profit is made
        pricePerShare = strategy.pricePerShare(); //update with current and check there should be no change in PPS
        asset.mint(address(yieldSource), profit);
        assertEq(strategy.pricePerShare(), pricePerShare);//pps is not changed

        //skip the remaining time {profitMaxUnlockTime/2}
        skip(profitMaxUnlockTime/2);

        //we should get a return of {% _profitFactor}
        assertRelApproxEq(strategy.pricePerShare(), wad+((wad*_profitFactor)/MAX_BPS), MAX_BPS);
        assertEq(strategy.totalDebt(), _amount + profit);
        assertEq(strategy.totalIdle(), 0);

        uint256 beforeBalanceDepositor = asset.balanceOf(address(_address));
        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        //the total amount redeemed should be equal to the deposited amount + first time profit (not the second time)
        assertEq(asset.balanceOf(address(_address)), beforeBalanceDepositor + _amount + profitReported);
        assertEq(strategy.totalDebt(), 0);
        assertEq(strategy.totalIdle(), 0);
        assertEq(asset.balanceOf(address(yieldSource)), profit);//the second time profit is still in the yield source
    }

    function test_withdrawWithUnrealizedLoss_reverts(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        uint256 loss = (_amount * _lossFactor) / MAX_BPS;

        //lets say some loss it made
        vm.prank(address(yieldSource));
        asset.transfer(address(90), loss);

        vm.expectRevert("Loss exceeds maxLoss");
        vm.prank(_address);
        strategy.withdraw(_amount, _address, _address);
    }

    function test_withdrawUnrealizedLoss_withMaxLoss(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        uint256 loss = (_amount * _lossFactor) / MAX_BPS;

        //lets say some loss it made
        vm.prank(address(yieldSource));
        asset.transfer(address(90), loss);

        uint256 beforeBalanceDepositor = asset.balanceOf(_address);
        uint256 expectedOut = _amount - loss;
        //should not revert
        vm.prank(_address);
        strategy.withdraw(_amount, _address, _address, _lossFactor);

        uint256 afterBalanceDepositor = asset.balanceOf(_address);

        assertEq(afterBalanceDepositor - beforeBalanceDepositor, expectedOut);
        assertEq(strategy.totalDebt(), 0);
        assertEq(strategy.totalIdle(), 0);
        assertEq(strategy.totalSupply(), 0);
        assertEq(strategy.pricePerShare(),wad);
    }

    function test_redeemWithUnrealisedLoss(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);
        uint256 loss = (_amount * _lossFactor) / MAX_BPS;

        vm.prank(address(yieldSource));
        asset.transfer(address(90), loss);

        uint256 beforeBalanceDepositor = asset.balanceOf(address(_address));

        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        uint256 afterBalanceDepositor = asset.balanceOf(address(_address));

        assertEq(afterBalanceDepositor - beforeBalanceDepositor, _amount - loss);
        assertEq(strategy.totalDebt(), 0);
        assertEq(strategy.totalIdle(), 0);
        assertEq(strategy.totalSupply(), 0);
        assertEq(strategy.pricePerShare(),wad);
    }

    function test_redeemWithUnrealizedLoss_allowNoLoss_reverts(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
                _address != address(strategy) &&
                _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);
        uint256 loss = (_amount * _lossFactor) / MAX_BPS;

        vm.prank(address(yieldSource));
        asset.transfer(address(90), loss);

        vm.expectRevert("Loss exceeds maxLoss");
        vm.prank(_address);
        strategy.redeem(_amount, _address, _address, 0);
    }

    function test_redeemWithUnrealizedLoss_customMaxLoss(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != address(yieldSource)
        );

        mintAndDepositIntoStrategy(strategy, _address, _amount);

        uint256 loss = (_amount * _lossFactor) / MAX_BPS;
        // Simulate a loss.
        vm.prank(address(yieldSource));
        asset.transfer(address(90), loss);

        uint256 beforeBalance = asset.balanceOf(_address);
        uint256 expectedOut = _amount - loss;

        // First set it to just under the expected loss.
        vm.expectRevert("Loss exceeds maxLoss");
        vm.prank(_address);
        strategy.redeem(_amount, _address, _address, _lossFactor - 1);

        // Now redeem with the correct loss.
        vm.prank(_address);
        strategy.redeem(_amount, _address, _address, _lossFactor);

        uint256 afterBalance = asset.balanceOf(_address);

        assertEq(afterBalance - beforeBalance, expectedOut);
        assertEq(strategy.totalDebt(), 0);
        assertEq(strategy.totalIdle(), 0);
        assertEq(strategy.totalSupply(), 0);
        assertEq(strategy.pricePerShare(), wad);
    }

    //---------------PROFIT LOCKING TESTS------------------//
    function test_gain(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        //Increase time to simulate interest being earned
        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime, 0);

        //lets say some profit it made
        uint256 profit = (_amount * _profitFactor) / MAX_BPS;

        createAndCheckProfit(strategy, profit);

        assertEq(strategy.pricePerShare(), wad);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount + profit);

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, profit/2);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount + (profit/2));

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, 0);

        assertRelApproxEq(strategy.pricePerShare(), wad+((wad*_profitFactor)/MAX_BPS), MAX_BPS);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount);

        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        checkStrategyTotals(strategy, 0, 0, 0, 0);
        assertEq(strategy.pricePerShare(), wad);
    }

    function test_loss(
        address _address,
        uint256 _amount,
        uint16 _lossFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _lossFactor = uint16(bound(uint256(_lossFactor), 1, 5_000));
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        //Increase time to simulate interest being earned
        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime, 0);

        //lets say some loss it made
        uint256 loss = (_amount * _lossFactor) / MAX_BPS;

        createAndCheckLoss(strategy, loss);

        assertRelApproxEq(
            strategy.pricePerShare(),
            wad-((wad*_lossFactor)/MAX_BPS),
            MAX_BPS / 10
        );

        checkStrategyTotals(strategy, _amount - loss, _amount - loss, 0, _amount);

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, 0);

        checkStrategyTotals(strategy, _amount - loss, _amount - loss, 0, _amount);

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, 0);

        console.log("Fails here");
        assertRelApproxEq(strategy.pricePerShare(), wad-((wad*_lossFactor)/MAX_BPS), MAX_BPS/10);

        checkStrategyTotals(strategy, _amount - loss, _amount - loss, 0, _amount);

        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        checkStrategyTotals(strategy, 0, 0, 0, 0);
        assertEq(strategy.pricePerShare(), wad);
    }

    function test_NoGain(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != address(yieldSource)
        );
        mintAndDepositIntoStrategy(strategy, _address, _amount);

        //Increase time to simulate interest being earned
        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime, 0);

        //lets say some profit it made
        uint256 profit = (_amount * _profitFactor) / MAX_BPS;

        createAndCheckProfit(strategy, profit);

        assertEq(strategy.pricePerShare(), wad);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount + profit);

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, profit/2);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount + (profit/2));

        increaseTimeAndCheckBuffer(strategy, profitMaxUnlockTime/2, 0);

        assertRelApproxEq(strategy.pricePerShare(), wad+((wad*_profitFactor)/MAX_BPS), MAX_BPS);

        checkStrategyTotals(strategy, _amount + profit, _amount + profit, 0, _amount);

        vm.prank(_address);
        strategy.redeem(_amount, _address, _address);

        checkStrategyTotals(strategy, 0, 0, 0, 0);
        assertEq(strategy.pricePerShare(), wad);
    }

    //---------------E2E TESTS------------------//
    struct StrategyInfo {
        ERC20Mock _asset;
        MockStrategy strategy;
        uint256 toDeposit;
        uint256 profit;
    }

    StrategyInfo[] public strategies;

    function test_depositAndRedeem(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
    _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
        _address != address(0) &&
        _address != address(strategy) &&
        _address != address(yieldSource)
    );
        uint256 toMake = (_amount % 6) + 5;
        uint256 i;
        for (i; i<toMake; ++i) {
            asset = new ERC20Mock();
            yieldSource = new MockYieldSource(address(asset));
            MockStrategy newStrategy = new MockStrategy(asset, address(yieldSource));

            vm.assume(
                _address != address(0) &&
                _address != address(newStrategy) &&
                _address != address(yieldSource)
            );

            uint256 toDeposit = _amount + i;

            mintAndDepositIntoStrategy(newStrategy, _address, toDeposit);

            checkStrategyTotals(
                newStrategy,
                toDeposit,
                toDeposit,
                0,
                toDeposit
            );

            strategies.push(StrategyInfo({
                _asset: asset,
                strategy: newStrategy,
                toDeposit: toDeposit,
                profit: 0
            }));
        }

        i = 0;
        for (i; i<toMake; ++i) {
            uint256 profit = (strategies[i].toDeposit * _profitFactor) / MAX_BPS + 1;
            asset = strategies[i]._asset;
            createAndCheckProfit(strategies[i].strategy, profit);
            strategies[i].profit = profit;
        }

        skip(profitMaxUnlockTime);

        i=0;
        for (i; i<toMake; ++i) {
            StrategyInfo memory info = strategies[i];
            asset = info._asset;
            checkStrategyTotals(
                info.strategy,
                info.toDeposit + info.profit,
                info.toDeposit + info.profit,
                0,
                info.toDeposit
            );

            uint256 before = asset.balanceOf(_address);

            vm.prank(_address);
            info.strategy.redeem(info.toDeposit, _address, _address);

            assertEq(asset.balanceOf(_address) - before, info.toDeposit + info.profit);
            assertEq(info.strategy.pricePerShare(), wad);
            checkStrategyTotals(
                info.strategy,
                0,
                0,
                0,
                0
            );
        }
    }

    function test_mintAndWithdraw(
        address _address,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != address(yieldSource)
        );
        uint256 toMake = (_amount % 6) + 5;
        uint256 i;
        for (i; i<toMake; ++i) {
            asset = new ERC20Mock();
            yieldSource = new MockYieldSource(address(asset));
            MockStrategy newStrategy = new MockStrategy(asset, address(yieldSource));

            vm.assume(
                _address != address(0) &&
                _address != address(newStrategy) &&
                _address != address(yieldSource)
            );

            uint256 toDeposit = _amount + i;

           // use {IERC4626.mint} instead of {IERC4626.deposit}
            asset.mint(_address, toDeposit);
            vm.startPrank(_address);
            asset.approve(address(newStrategy), toDeposit);
            newStrategy.mint(toDeposit, _address);
            vm.stopPrank();

            checkStrategyTotals(
                newStrategy,
                toDeposit,
                toDeposit,
                0,
                toDeposit
            );

            strategies.push(StrategyInfo({
                _asset: asset,
                strategy: newStrategy,
                toDeposit: toDeposit,
                profit: 0
            }));
        }

        i = 0;
        for (i; i<toMake; ++i) {
            uint256 profit = (strategies[i].toDeposit * _profitFactor) / MAX_BPS + 1;
            asset = strategies[i]._asset;
            createAndCheckProfit(strategies[i].strategy, profit);
            strategies[i].profit = profit;
        }

        skip(profitMaxUnlockTime);

        i = 0;

        for (i; i < toMake; ++i) {
            StrategyInfo memory info = strategies[i];
            asset = info._asset;

            checkStrategyTotals(
                info.strategy,
                info.toDeposit + info.profit,
                info.toDeposit + info.profit,
                0,
                info.toDeposit
            );

            uint256 before = asset.balanceOf(_address);

            vm.prank(_address);
            info.strategy.withdraw(
                info.toDeposit + info.profit,
                _address,
                _address
            );

            assertEq(
                asset.balanceOf(_address) - before,
                info.toDeposit + info.profit
            );
            assertEq(info.strategy.pricePerShare(), wad);

            checkStrategyTotals(info.strategy, 0, 0, 0, 0);
        }
    }

    function test_multipleStrategiesTokensAndUsers(
        address _address,
        address _secondAddress,
        uint256 _amount,
        uint16 _profitFactor
    ) public {
        _amount = bound(_amount, minFuzzAmount, maxFuzzAmount);
        vm.assume(
            _address != address(0) &&
            _address != address(strategy) &&
            _address != _secondAddress
        );
        vm.assume(
            _secondAddress != address(0) &&
            _secondAddress != address(strategy)
        );
        _profitFactor = uint16(bound(uint256(_profitFactor), 10, MAX_BPS));

        // Pick a random amount of strategies to add between 5-10
        uint256 toMake = (_amount % 6) + 5;
        uint256 i;

        for (i; i < toMake; ++i) {
            asset = new ERC20Mock();
            yieldSource = new MockYieldSource(address(asset));
            MockStrategy newStrategy = new MockStrategy(asset, address(yieldSource));

            vm.assume(
                _address != address(asset) &&
                _address != address(yieldSource) &&
                _address != address(newStrategy)
            );
            vm.assume(
                _secondAddress != address(asset) &&
                _secondAddress != address(yieldSource) &&
                _secondAddress != address(newStrategy)
            );

            // Depsit a unique amount for each one
            uint256 toDeposit = _amount + i;

            mintAndDepositIntoStrategy(newStrategy, _address, toDeposit);

            checkStrategyTotals(
                newStrategy,
                toDeposit,
                toDeposit,
                0,
                toDeposit
            );

            strategies.push(StrategyInfo(asset, newStrategy, toDeposit, 0));
        }

        i = 0;

        for (i; i < toMake; ++i) {
            uint256 profit = (strategies[i].toDeposit * _profitFactor) /
                        MAX_BPS +
                        1;

            // Set the global asset for this specific strategy
            asset = strategies[i]._asset;

            createAndCheckProfit(strategies[i].strategy, profit);

            strategies[i].profit = profit;
        }

        skip(5 days);

        i = 0;

        // Do another deposit by a second address
        for (i; i < toMake; ++i) {
            StrategyInfo memory info = strategies[i];
            asset = info._asset;

            mintAndDepositIntoStrategy(
                info.strategy,
                _secondAddress,
                info.toDeposit
            );

            checkStrategyTotals(
                info.strategy,
                info.toDeposit * 2 + info.profit,
                info.toDeposit * 2 + info.profit,
                0
            );

            // make sure second address got less shares than first
            assertGt(
                info.strategy.balanceOf(_address),
                info.strategy.balanceOf(_secondAddress)
            );
        }

        skip(5 days);

        i = 0;

        for (i; i < toMake; ++i) {
            StrategyInfo memory info = strategies[i];
            asset = info._asset;

            checkStrategyTotals(
                info.strategy,
                info.toDeposit * 2 + info.profit,
                info.toDeposit * 2 + info.profit,
                0
            );

            uint256 before = asset.balanceOf(_address);

            vm.prank(_address);
            info.strategy.redeem(info.toDeposit, _address, _address);

            assertGt(asset.balanceOf(_address) - before, info.toDeposit);

            before = asset.balanceOf(_secondAddress);
            uint256 balance = info.strategy.balanceOf(_secondAddress);

            vm.prank(_secondAddress);
            info.strategy.redeem(balance, _secondAddress, _secondAddress);

            assertGt(asset.balanceOf(_secondAddress) - before, info.toDeposit);

            assertEq(info.strategy.pricePerShare(), wad);
            checkStrategyTotals(info.strategy, 0, 0, 0);
        }
    }


    //---------------HELPER FUNCTIONS------------------//
    function mintAndDepositIntoStrategy(
        MockStrategy _strategy,
        address _user,
        uint256 _amount
    ) internal {
        asset.mint(_user, _amount);
        vm.startPrank(_user);
        asset.approve(address(_strategy), _amount);
        _strategy.deposit(_amount,_user);
        vm.stopPrank();
    }

    function assertRelApproxEq(
        uint256 a,
        uint256 b,
        uint256 maxPercentDelta
    ) internal virtual {
        uint256 delta = a > b ? a - b : b - a;
        uint256 maxRelDelta = b / maxPercentDelta;

        if (delta > maxRelDelta) {
            emit log("Error: a ~= b not satisfied [uint]");
            emit log_named_uint("  Expected", b);
            emit log_named_uint("    Actual", a);
            emit log_named_uint(" Max Delta", maxRelDelta);
            emit log_named_uint("     Delta", delta);
            fail();
        }
    }

    function increaseTimeAndCheckBuffer(
        MockStrategy _strategy,
        uint256 _time,
        uint256 _buffer
    ) public {
        skip(_time);
        // We give a buffer or 1 wei for rounding
        assertApproxEqAbs(
            _strategy.balanceOf(address(_strategy)),
            _buffer,
            1,
            "!Buffer"
        );
    }

    function createAndCheckProfit(
        MockStrategy _strategy,
        uint256 profit
    ) public {
        uint256 startingAssets = _strategy.totalAssets();
        asset.mint(address(_strategy), profit);

        // Check the event matches the expected values
        vm.expectEmit(true, true, true, true, address(_strategy));
        emit Reported(profit, 0);

        vm.prank(keeper);
        (uint256 _profit, uint256 _loss) = _strategy.report();

        assertEq(profit, _profit, "profit reported wrong");
        assertEq(_loss, 0, "Reported loss");
        assertEq(
            _strategy.totalAssets(),
            startingAssets + profit,
            "total assets wrong"
        );
    }

    function createAndCheckLoss(
        MockStrategy _strategy,
        uint256 loss
    ) public {
        uint256 startingAssets = _strategy.totalAssets();

        yieldSource.simulateLoss(loss);
        // Check the event matches the expected values
        vm.expectEmit(true, true, true, true, address(_strategy));
        emit Reported(0, loss);

        vm.prank(keeper);
        (uint256 _profit, uint256 _loss) = _strategy.report();

        assertEq(0, _profit, "profit reported wrong");
        assertEq(_loss, loss, "Reported loss");
        assertEq(
            _strategy.totalAssets(),
            startingAssets - loss,
            "total assets wrong"
        );
    }

    function checkStrategyTotals(
        MockStrategy _strategy,
        uint256 _totalAssets,
        uint256 _totalDebt,
        uint256 _totalIdle,
        uint256 _totalSupply
    ) public {
        assertEq(_strategy.totalAssets(), _totalAssets, "!totalAssets");
        assertEq(_strategy.totalDebt(), _totalDebt, "!totalDebt");
        assertEq(_strategy.totalIdle(), _totalIdle, "!totalIdle");
        assertEq(_totalAssets, _totalDebt + _totalIdle, "!Added");
        // We give supply a buffer or 1 wei for rounding
        assertApproxEqAbs(_strategy.totalSupply(), _totalSupply, 1, "!supply");
    }

    // For checks without totalSupply while profit is unlocking
    function checkStrategyTotals(
        MockStrategy _strategy,
        uint256 _totalAssets,
        uint256 _totalDebt,
        uint256 _totalIdle
    ) public {
        assertEq(_strategy.totalAssets(), _totalAssets, "!totalAssets");
        assertEq(_strategy.totalDebt(), _totalDebt, "!totalDebt");
        assertEq(_strategy.totalIdle(), _totalIdle, "!totalIdle");
        assertEq(_totalAssets, _totalDebt + _totalIdle, "!Added");
    }

    //---------------EVENT------------------//
    event Reported(uint256 profit, uint256 loss);
}