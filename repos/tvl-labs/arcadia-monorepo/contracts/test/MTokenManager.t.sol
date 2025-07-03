// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/hub/MTokenManager.sol";
import "../src/modules/MTokenRegistry.sol";
import {MTokenInfo, SpokeTokenInfo} from "../src/types/MToken.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {SystemState} from "./SystemState.sol";
import {RolesLib} from "../src/libraries/RolesLib.sol";
import {WithdrawalHandler} from "../src/hub/MTokenManager.sol";

contract LockerMock {
    MTokenManager public manager;

    constructor(address _manager) {
        manager = MTokenManager(_manager);
    }

    function callWithdrawMToken(address from, address mToken, uint256 amount) external payable {
        manager.withdrawMToken(from, mToken, amount);
    }
}

contract MinterLock {
    MTokenManager public manager;

    constructor(address _manager) {
        manager = MTokenManager(_manager);
    }

    function callMintMToken(address to, address mToken, uint256 amount) external {
        manager.mintMToken(to, mToken, amount);
    }
}

contract MinimalWithdrawalHandler is WithdrawalHandler {
    event WithdrawCalled(address spokeToken, uint32 chainId, address owner, uint256 amount);

    function withdraw(address spokeToken, uint32 chainId, address owner, uint256 amount) external payable {
        emit WithdrawCalled(spokeToken, chainId, owner, amount);
    }
}

contract MTokenManagerTest is SystemState {
    LockerMock public locker;
    MinterLock public minter;
    MinimalWithdrawalHandler public withdrawalHandler;

    function testMintMToken() public {
        uint256 initialBal = mTokenManager.getBalanceOfUser(user1, address(mToken));

        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken), 100 ether);

        uint256 finalBal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        assertEq(finalBal, initialBal + 100 ether, "Final user1 balance should be 100 ether");
    }

    function testMintMTokenUnauthorized() public {
        vm.startPrank(owner);
        vm.expectRevert(abi.encodeWithSignature("AccessManagedUnauthorized(address)", owner));

        mTokenManager.mintMToken(user1, address(mToken), 100 ether);
        vm.stopPrank();
    }

    // function testRefundUser() public {
    //     vm.prank(owner);
    //     manager.setupRefundAgent(user2);

    //     uint256 initialBal = mTokenManager.getBalanceOfUser(user1, mToken);
    //     assertEq(initialBal, 0, "Initial balance should be 0");

    //     vm.prank(user2);
    //     mTokenManager.refundUser(user1, mToken, 77 ether);

    //     uint256 finalBal = mTokenManager.getBalanceOfUser(user1, mToken);
    //     assertEq(finalBal, 77 ether, "User1 should receive 77 ether after refund");
    // }

    function testUnauthorizedWithdraw() public {
        vm.expectRevert(abi.encodeWithSignature("AccessManagedUnauthorized(address)", user2));

        vm.prank(user2);
        mTokenManager.withdrawMToken(user1, address(mToken), 100 ether);
    }

    function testWithdrawMToken() public {
        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken), 200 ether);

        vm.expectRevert(abi.encodeWithSignature("AccessManagedUnauthorized(address)", owner));

        vm.prank(owner);
        mTokenManager.withdrawMToken(user1, address(mToken), 50 ether);
    }

    function testWithdrawMTokenAuthorized() public {
        withdrawalHandler = new MinimalWithdrawalHandler();
        vm.prank(contractsManager);
        mTokenManager.setWithdrawalHandler(address(withdrawalHandler));

        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken), 200 ether);

        uint256 initialBal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        //assertEq(initialBal, 200 ether, "Initial balance should be 200 ether");

        vm.prank(medusa);
        mTokenManager.withdrawMToken(user1, address(mToken), 50 ether);

        uint256 finalBal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        assertEq(finalBal, initialBal - 50 ether, "Balance should be reduced after withdrawal");
    }

    function testBurnMToken() public {
        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken), 100 ether);

        uint256 initialBal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        // assertEq(initialBal, 100 ether, "Initial balance should be 100 ether");

        vm.prank(address(mToken));
        mTokenManager.mTokenApprove(user1, address(minter), 50 ether, address(mToken));

        vm.prank(address(mToken));
        mTokenManager.burnMToken(address(minter), user1, 50 ether, address(mToken));

        uint256 finalBal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        assertEq(finalBal, initialBal - 50 ether, "User1 should have 50 less ether after burn");
    }

    function testApproveAndTransfer() public {
        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken), 100 ether);
        uint256 user1BalBefore = mTokenManager.getBalanceOfUser(user1, address(mToken));
        uint256 user2BalBefore = mTokenManager.getBalanceOfUser(user2, address(mToken));

        vm.prank(address(mToken));
        mTokenManager.mTokenApprove(user1, user2, 50 ether, address(mToken));

        vm.prank(address(mToken));
        mTokenManager.mTokenTransferFrom(user2, user1, user2, 50 ether, address(mToken));

        uint256 user1Bal = mTokenManager.getBalanceOfUser(user1, address(mToken));
        uint256 user2Bal = mTokenManager.getBalanceOfUser(user2, address(mToken));

        assertEq(user1Bal, user1BalBefore - 50 ether, "User1 balance should be reduced");
        assertEq(user2Bal, user2BalBefore + 50 ether, "User2 balance should be increased");
    }

    function testPauseAndUnpauseMToken() public {
        vm.prank(contractsManager);
        mTokenRegistry.pauseMToken(address(mToken2));

        vm.expectRevert(abi.encodeWithSignature("MTokenPaused()"));
        vm.prank(mtokenMinter);
        mTokenManager.mintMToken(user1, address(mToken2), 100 ether);

        vm.prank(contractsManager);
        mTokenRegistry.unpauseMToken(address(mToken2));

        vm.prank(mtokenMinter);
        mTokenManager.mintMToken(user1, address(mToken2), 100 ether);
    }

    function testDestroyMToken() public {
        vm.prank(contractsManager);
        mTokenRegistry.destroyMToken(address(mToken2));

        vm.expectRevert(abi.encodeWithSignature("MTokenDestroyed()"));
        vm.prank(address(mtokenMinter));
        mTokenManager.mintMToken(user1, address(mToken2), 100 ether);
    }

    function testInvalidMToken() public {
        vm.expectRevert(abi.encodeWithSignature("MTokenRegistry__UnsupportedMToken()"));
        mTokenRegistry.checkValidMToken(address(0xDEAD));
    }

    function testSetIntentBook() public {
        address newIntentBook = address(0x1234);
        vm.prank(contractsManager);
        mTokenManager.setIntentBook(newIntentBook);
    }

    function testSetReceiptManager() public {
        address newReceiptManager = address(0x5678);
        vm.prank(contractsManager);
        mTokenManager.setReceiptManager(newReceiptManager);
    }

    function setupMinter(address _minter) public {
        vm.startPrank(owner);
        accessManager.grantRole(RolesLib.MTOKEN_MINTER_ROLE, _minter, 0);
        bytes4[] memory mTokenManagerMinterSelectors;
        mTokenManagerMinterSelectors[0] = mTokenManager.mintMToken.selector;
        accessManager.setTargetFunctionRole(
            address(mTokenRegistry), mTokenManagerMinterSelectors, RolesLib.MTOKEN_MINTER_ROLE
        );
        vm.stopPrank();
    }
}
