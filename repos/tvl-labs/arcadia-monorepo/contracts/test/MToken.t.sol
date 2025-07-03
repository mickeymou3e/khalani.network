// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/hub/MToken.sol";
import "../src/hub/MTokenManager.sol";
import "../src/modules/MTokenRegistry.sol";
import {SystemState} from "./SystemState.sol";

contract MTokenTest is SystemState {
    MTokenManager public manager;
    MTokenRegistry public registry;

    // address public owner = address(0xA11CE);
    address public user3 = address(0xBEEF);
    address public user4 = address(0xC0FFEE);

    uint256 public initialSupply = 1000 ether;

    function testMint() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        uint256 balance = mToken.balanceOf(user3);
        assertEq(balance, 100 ether, "user3 should have 100 MTK");
    }

    function testMintUnauthorized() public {
        vm.expectRevert("Ownable: caller is not the owner");
        mToken.mint(user3, 100 ether);
    }

    function testBurn() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        mToken.burn(50 ether);

        uint256 balance = mToken.balanceOf(user3);
        assertEq(balance, 50 ether, "user3 should have 50 MTK after burning");
    }

    function testBurnUnauthorized() public {
        vm.prank(user4);
        vm.expectRevert(abi.encodeWithSignature("InsufficientMTokens()"));
        mToken.burn(50 ether);
    }

    function testBurnWithoutBalance() public {
        vm.prank(address(manager));
        vm.expectRevert(abi.encodeWithSignature("InsufficientMTokens()"));
        mToken.burn(100 ether);
    }

    function testTransfer() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        mToken.transfer(user4, 30 ether);

        uint256 balance1 = mToken.balanceOf(user3);
        uint256 balance2 = mToken.balanceOf(user4);

        assertEq(balance1, 70 ether, "user3 should have 70 MTK");
        assertEq(balance2, 30 ether, "user4 should have 30 MTK");
    }

    function testTransferMoreThanBalance() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        vm.expectRevert();
        mToken.transfer(user4, 200 ether);
    }

    function testApproveAndTransferFrom() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        mToken.approve(user4, 50 ether);

        vm.prank(user4);
        mToken.transferFrom(user3, user4, 50 ether);

        assertEq(mToken.balanceOf(user3), 50 ether, "user3 should have 50 MTK");
        assertEq(mToken.balanceOf(user4), 50 ether, "user4 should have 50 MTK");
    }

    function testTransferFromWithoutApproval() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user4);
        vm.expectRevert();
        mToken.transferFrom(user3, user4, 50 ether);
    }

    function testBurnFrom() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        mToken.approve(user4, 50 ether);

        vm.prank(user4);
        mToken.burnFrom(user3, 50 ether);

        assertEq(mToken.balanceOf(user3), 50 ether, "user3 should have 50 MTK after burnFrom");
    }

    function testBurnMoreThanBalance() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user3);
        vm.expectRevert();
        mToken.burn(200 ether);
    }

    function testTotalSupply() public {
        uint256 totalSupplyBefore = mToken.totalSupply();
        vm.prank(address(mTokenManager));

        mToken.mint(user3, 100 ether);

        uint256 totalSupply = mToken.totalSupply();
        assertEq(totalSupply, totalSupplyBefore + 100 ether, "Total supply should be 100 MTK");
    }

    function testUnauthorizedBurnFrom() public {
        vm.prank(address(mTokenManager));
        mToken.mint(user3, 100 ether);

        vm.prank(user4);
        vm.expectRevert();
        mToken.burnFrom(user3, 50 ether);
    }
}
