pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/LiquidityReserves/khalani/kai/KaiLiquidityAggregator.sol";
import "../src/Tokens/ERC20MintableBurnableDecimal.sol";
import "../src/LiquidityReserves/LibScaling.sol";

contract KaiLiquidityAggregatorTest is Test {

    uint internal constant DECIMAL_LIMITER = 1e30;
    uint internal constant MAX_DECIMAL = 18;

    event WhiteListedTokenAdded(
        address indexed asset
    );

    event WhiteListedTokenRemoved(
        address indexed asset
    );

    KaiLiquidityAggregator la;
    ERC20MintableBurnable klnUSDC;
    ERC20MintableBurnable klnUSDT;
    ERC20MintableBurnable kai;
    address user;

    function setUp() public {
        user = vm.addr(1);
        klnUSDC = new ERC20MintableBurnable("klnUSDC","klnUSDC");
        klnUSDT = new ERC20MintableBurnable("klnUSDT","klnUSDT");
        kai = new ERC20MintableBurnable("Kai","KAI");

        la = new KaiLiquidityAggregator(address(kai));
        kai.addMinterRole(address(la));

        la.addWhiteListedAsset(address(klnUSDC));
        la.addWhiteListedAsset(address(klnUSDT));
    }

    function test_TokenAdd() public{
        ERC20MintableBurnable klnBUSD = new ERC20MintableBurnable("klnBUSD","klnBUSD");
        vm.expectEmit(true,false,false,true);
        emit WhiteListedTokenAdded(address(klnBUSD));
        la.addWhiteListedAsset(address(klnBUSD));
    }

    function test_TokenRemove() public{
        vm.expectEmit(true,false,false,true);
        emit WhiteListedTokenRemoved(address(klnUSDC));
        la.removeWhiteListedAddress(address(klnUSDC));
    }

    function testMintKai(uint balanceAmount, uint mintAmount) public{
        balanceAmount = bound(balanceAmount,0,DECIMAL_LIMITER);
        vm.assume(balanceAmount>0 && mintAmount>0 && balanceAmount>mintAmount);
        klnUSDC.mint(user,balanceAmount);

        vm.startPrank(user);
        IERC20(address(klnUSDC)).approve(address(la),mintAmount);
        Token memory token = Token(address (klnUSDC),mintAmount);
        vm.expectEmit(address(la));
        emit Deposit(user,user,token);
        la.deposit(token, user);
        vm.stopPrank();

        assertEq(
            klnUSDC.balanceOf(user),
            balanceAmount - mintAmount
        );

        assertEq(
            kai.balanceOf(user),
            mintAmount
        );

        assertEq(
            klnUSDC.balanceOf(address(la)),
            mintAmount
        );

        vm.startPrank(user);
        vm.expectRevert();
        la.deposit(Token(address(klnUSDT),mintAmount),user);
        vm.stopPrank();

        assertEq(
            klnUSDT.balanceOf(user),
            0
        );

        assertEq(
            klnUSDT.balanceOf(address(la)),
            0
        );

    }

    function test_MintKai_InvalidAsset(uint mintAmount) public{
        ERC20MintableBurnable newAsset = new ERC20MintableBurnable("DUMMY","DUMMY");
        newAsset.mint(user,mintAmount);
        //trying with a non-whitelisted asset
        vm.startPrank(user);
        newAsset.approve(address(la),mintAmount);
        vm.expectRevert(abi.encodeWithSelector(AssetNotWhiteListed.selector,address(newAsset)));
        la.deposit(Token(address (newAsset),mintAmount),user);
        vm.stopPrank();
    }

    function test_MintKai_InvalidAmount(uint mintAmount, uint approvalAmount) public{
        vm.assume(approvalAmount<mintAmount);
        klnUSDC.mint(user,mintAmount);
        //trying with a non-whitelisted asset
        vm.startPrank(user);
        klnUSDC.approve(address(la),approvalAmount);
        vm.expectRevert("ERC20: insufficient allowance");
        la.deposit(Token(address (klnUSDC),mintAmount),user);
        vm.stopPrank();
    }

    function test_MintKai_WithDecimals(uint amount, uint8 dec) public{
        amount = bound(amount,0,DECIMAL_LIMITER);
        dec = uint8(bound(dec,1,MAX_DECIMAL));
        ERC20MintableBurnableDecimal klnBUSD = new ERC20MintableBurnableDecimal("klnBUSDC","klnBUSDC", dec);
        la.addWhiteListedAsset(address(klnBUSD));

        ERC20MintableBurnableDecimal(klnBUSD).mint(user,amount);
        Token memory token;
        token = Token(address(klnBUSD),amount);
        vm.startPrank(user);
        IERC20(klnBUSD).approve(address(la),amount);
        la.deposit(token,user);
        vm.stopPrank();

        assertEq(
            kai.balanceOf(user),
            LibScaling._computeScalingFactor(address(klnBUSD),amount)
        );

        assertEq(
            klnBUSD.balanceOf(user),
            0
        );

    }

    event Deposit(
        address indexed sender,
        address receiver,
        Token token
    );

}