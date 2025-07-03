// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/hub/ReceiptManager.sol";
import "../src/hub/MTokenManager.sol";
import {Receipt as ReceiptStruct} from "../src/types/Receipt.sol";
import {SystemState} from "./SystemState.sol";

contract ReceiptManagerTest is SystemState {
    address public anotherUser = makeAddr("anotherUser");
    uint256 public amount;
    bytes32 public intentHash;
    bytes32 public receiptId;

    event ReceiptCreated(bytes32 indexed receiptId, address indexed owner, address mToken, uint256 amount);
    event ReceiptRedeemed(bytes32 indexed receiptId, address indexed owner, address mToken, uint256 amount);
    event ReceiptLocked(bytes32 indexed receiptId);
    event ReceiptUnlocked(bytes32 indexed receiptId);

    function testCreateAndGetReceipt() public {
        vm.startPrank(address(intentBook));

        // Expect the ReceiptCreated event
        vm.expectEmit(false, true, true, true);
        emit ReceiptCreated(receiptId, owner, address(mToken), amount);

        bytes32 newReceiptId = receiptManager.createReceipt(owner, address(mToken), amount, intentHash);

        ReceiptStruct memory receipt = receiptManager.getReceipt(newReceiptId);
        assertEq(receipt.owner, owner, "Owner should match");
        assertEq(receipt.mToken, address(mToken), "MToken should match");
        assertEq(receipt.mTokenAmount, amount, "Amount should match");
        assertEq(receipt.intentHash, intentHash, "Intent hash should match");
        bytes32[] memory receipts = receiptManager.getReceiptsByOwner(owner);
        assertEq(receipts.length, 1, "Should be one receipt");
        bytes32 secondReceiptId = receiptManager.createReceipt(owner, address(mToken), amount, intentHash);
        assertNotEq(newReceiptId, secondReceiptId, "Receipt Ids should be unique");
        bytes32[] memory receiptsAfter = receiptManager.getReceiptsByOwner(owner);
        assertEq(receiptsAfter.length, 2, "Should be two receipts");
        vm.stopPrank();
    }

    function testCannotCreateReceiptWithoutIntentBook() public {
        vm.startPrank(owner);
        vm.expectRevert(ReceiptManager.UnauthorizedReceiptIssuance.selector);
        receiptManager.createReceipt(owner, address(mToken), amount, intentHash);
        vm.stopPrank();
    }

    function testLockReceipt() public {
        vm.startPrank(address(intentBook));

        // Expect the ReceiptLocked event
        vm.expectEmit(true, true, true, true);
        emit ReceiptLocked(receiptId);

        receiptManager.lockReceipt(receiptId);
        vm.stopPrank();
    }

    function testCannotLockReceiptWithoutIntentBook() public {
        vm.startPrank(owner);
        vm.expectRevert(ReceiptManager.UnauthorizedLockOperation.selector);
        receiptManager.lockReceipt(receiptId);
        vm.stopPrank();
    }

    function testCannotLockAlreadyLockedReceipt() public {
        vm.startPrank(address(intentBook));
        receiptManager.lockReceipt(receiptId);

        vm.expectRevert(ReceiptManager.ReceiptAlreadyLocked.selector);
        receiptManager.lockReceipt(receiptId);
        vm.stopPrank();
    }

    function testUnlockReceipt() public {
        vm.startPrank(address(intentBook));
        receiptManager.lockReceipt(receiptId);

        // Expect the ReceiptUnlocked event
        vm.expectEmit(true, true, true, true);
        emit ReceiptUnlocked(receiptId);

        receiptManager.unlockReceipt(receiptId);
        vm.stopPrank();
    }

    function testCannotUnlockReceiptWithoutIntentBook() public {
        vm.startPrank(owner);
        vm.expectRevert(ReceiptManager.UnauthorizedLockOperation.selector);
        receiptManager.unlockReceipt(receiptId);
        vm.stopPrank();
    }

    function testCannotUnlockNonLockedReceipt() public {
        vm.startPrank(address(intentBook));
        vm.expectRevert(ReceiptManager.ReceiptNotLocked.selector);
        receiptManager.unlockReceipt(receiptId);
        vm.stopPrank();
    }

    function testCannotRedeemReceiptIfAlreadyLocked() public {
        vm.startPrank(address(intentBook));
        receiptManager.lockReceipt(receiptId);
        vm.expectRevert(ReceiptManager.ReceiptAlreadyLocked.selector);
        receiptManager.redeem(receiptId);
        vm.stopPrank();
    }

    // function testUnauthorizedCallerRedeemReceipt() public {
    //     vm.startPrank(address(intentBook));
    //     bytes32 newReceiptId = receiptManager.createReceipt(owner, address(mToken), amount, intentHash);
    //     vm.expectRevert(MTokenManager.UnauthorizedCaller.selector);

    //     receiptManager.redeem(newReceiptId);
    //     vm.stopPrank();
    // }

    function testCannotRedeemNonExistentReceipt() public {
        bytes32 fakeReceiptId = keccak256(abi.encode(owner, address(mToken), 999, block.number));
        vm.startPrank(address(intentBook));
        vm.expectRevert();
        receiptManager.redeem(fakeReceiptId);
        vm.stopPrank();
    }

    function hasInitialReceipt() public {
        amount = 1000 ether;
        intentHash = keccak256(abi.encode(owner, address(mToken), amount, block.number));

        // Create a receipt using intentBook (since only it can call createReceipt)
        vm.startPrank(address(intentBook));
        receiptId = receiptManager.createReceipt(owner, address(mToken), amount, intentHash);
        vm.stopPrank();
    }
}
