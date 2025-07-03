// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/event_system/apps/bridge/EthAipRedeemer.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {CustomERC20} from "../src/spoke/CustomERC20.sol";

contract EthAipRedeemerTest is Test {
    EthAipRedeemer public ethAipRedeemer;
    CustomERC20 public mockToken;
    address owner = address(0x1);
    address redeemer = address(0x2);
    address otherUser = address(0x3);
    uint256 initialBalance = 1000 ether;
    uint256 ethAipRate = 1e18;

    function setUp() public {
        vm.startPrank(owner);
        mockToken = new CustomERC20("Mock Token", "MKT");
        mockToken.mint(owner, initialBalance);
        ethAipRedeemer = new EthAipRedeemer(address(mockToken));
        ethAipRedeemer.setAipEthRate(ethAipRate);
        ethAipRedeemer.addRedeemer(redeemer);
        vm.stopPrank();
    }

    function testDepositEthMToken() public {
        vm.startPrank(owner);
        mockToken.approve(address(ethAipRedeemer), initialBalance);
        ethAipRedeemer.depositEthMToken(initialBalance);
        assertEq(mockToken.balanceOf(address(ethAipRedeemer)), initialBalance);
        vm.stopPrank();
    }

    function testRevertWhenDepositingZeroEthMToken() public {
        vm.startPrank(owner);
        vm.expectRevert(EthAipRedeemer.EthAipRedeemer__InvalidDepositAmount.selector);
        ethAipRedeemer.depositEthMToken(0);
        vm.stopPrank();
    }

    function testRedeemAip() public {
        vm.startPrank(owner);
        mockToken.mint(owner, 100 ether);
        mockToken.approve(address(ethAipRedeemer), 100 ether);
        ethAipRedeemer.depositEthMToken(100 ether);
        vm.stopPrank();

        vm.deal(redeemer, 1 ether);
        vm.startPrank(redeemer);
        ethAipRedeemer.redeemAip{value: 1 ether}();
        assertEq(mockToken.balanceOf(redeemer), 1 ether);
        vm.stopPrank();
    }

    function testRevertIfRedeemerNotAuthorized() public {
        vm.deal(otherUser, 1 ether);
        vm.startPrank(otherUser);
        vm.expectRevert(EthAipRedeemer.EthAipRedeemer__NotAuthorized.selector);
        ethAipRedeemer.redeemAip{value: 1 ether}();
        vm.stopPrank();
    }
}
