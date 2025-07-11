pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/LiquidityReserves/khalani/kln/LiquidityAggregator.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/InterchainMessaging/Errors.sol";
import "../src/Tokens/ERC20MintableBurnableDecimal.sol";
import "../src/LiquidityReserves/LibScaling.sol";

contract LiquidityAggregatorTest is Test {
    uint internal constant DECIMAL_LIMITER = 1e30;
    uint internal constant MAX_DECIMAL = 18;
    address usdcEth;
    address usdcAvax;
    address usdtEth;
    address usdtAvax;
    address klnUsdc;
    address klnUsdt;
    address user;
    LiquidityAggregator la;

    function setUp() public {
        user = vm.addr(1);
        usdcEth = address(new ERC20MintableBurnable("USDC/ETH","USDC.Eth"));
        usdcAvax = address(new ERC20MintableBurnable("USDC/Avax","USDT.Avax"));
        usdtEth = address(new ERC20MintableBurnable("USDT/ETH","USDT.Eth"));
        usdtAvax = address(new ERC20MintableBurnable("USDT/Avax","USDT.Avax"));
        klnUsdc = address(new ERC20MintableBurnable("klnUSDC","klnUSDC"));
        klnUsdt = address(new ERC20MintableBurnable("klnUSDT","klnUSDT"));
        la = new LiquidityAggregator();
        ERC20MintableBurnable(klnUsdc).addMinterRole(address(la));
        ERC20MintableBurnable(klnUsdt).addMinterRole(address(la));
        la.registerTokenForKlnToken(usdcEth,klnUsdc);
        la.registerTokenForKlnToken(usdcAvax,klnUsdc);
        la.registerTokenForKlnToken(usdtEth,klnUsdt);
    }

    function test_Access() public {
        //should fail
        vm.prank(user); //random user
        vm.expectRevert("Only the contract owner may perform this action"); //onlyOwner
        la.registerTokenForKlnToken(usdcEth,klnUsdc);

        //should pass - owner calls
        vm.expectEmit(address(la));
        emit AssetRegistered(usdcEth,klnUsdc);
        la.registerTokenForKlnToken(usdcEth,klnUsdc);
    }

    function test_deposit(uint256 amount) public {
        IERC20MintableBurnable(usdcEth).mint(user,amount);
        Token memory token;
        token = Token(usdcEth,amount);
        vm.startPrank(user);
        IERC20(usdcEth).approve(address(la),amount);
        la.deposit(token,user);
        vm.stopPrank();
        assertEq(
            IERC20(klnUsdc).balanceOf(user),
            LibScaling._computeScalingFactor(address(usdcEth),amount)
        );
        assertEq(
            IERC20(usdcEth).balanceOf(address(la)),
            amount
        );
    }

    function test_deposit_InvalidToken(uint256 amount) public {
        IERC20MintableBurnable(usdtAvax).mint(user,amount);
        Token memory token;
        token = Token(usdtAvax,amount);
        vm.startPrank(user);
        IERC20(usdtAvax).approve(address(la),amount);
        vm.expectRevert(abi.encodeWithSelector(AssetNotSupported.selector,usdtAvax));
        la.deposit(token,user);
        vm.stopPrank();
    }

    function test_deposit_InvalidAmount(uint256 amount, uint256 approval) public {
        vm.assume(approval<amount);
        IERC20MintableBurnable(usdcEth).mint(user,amount);
        Token memory token;
        token = Token(usdcEth,amount);
        vm.startPrank(user);
        IERC20(usdcEth).approve(address(la),approval);
        vm.expectRevert("ERC20: insufficient allowance");
        la.deposit(token,user);
        vm.stopPrank();
    }

    function test_deposit_WithDecimals(uint amount, uint8 dec) public{
        amount = bound(amount,0,DECIMAL_LIMITER);
        dec = uint8(bound(dec,1,MAX_DECIMAL));

        address usdcPolygon = address(new ERC20MintableBurnableDecimal("USDC/POLYGON","USDC.Polygon",dec));
        la.registerTokenForKlnToken(usdcPolygon,klnUsdc);
        ERC20MintableBurnableDecimal(usdcPolygon).mint(user,amount);
        Token memory token;
        token = Token(usdcPolygon,amount);
        vm.startPrank(user);
        IERC20(usdcPolygon).approve(address(la),amount);
        la.deposit(token,user);
        vm.stopPrank();

        assertEq(
            IERC20(klnUsdc).balanceOf(user),
            LibScaling._computeScalingFactor(address(usdcPolygon),amount)
        );
    }

    event Deposit(
        address indexed sender,
        address receiver,
        Token token
    );

    event AssetRegistered(
        address mirrorToken,
        address klnToken
    );
}