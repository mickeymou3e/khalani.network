// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Receipt} from "../types/Receipt.sol";
import {MTokenManager} from "./MTokenManager.sol";

contract ReceiptManager {
    // ***************** //
    // **** ERRORS **** //
    // ***************** //
    error ReceiptNotFound();
    error UnauthorizedRedemption();
    error UnauthorizedReceiptIssuance();
    error ReceiptAlreadyLocked();
    error ReceiptNotLocked();
    error UnauthorizedLockOperation();

    // ***************** //
    // **** EVENTS ***** //
    // ***************** //
    event ReceiptCreated(bytes32 indexed receiptId, address indexed owner, address mToken, uint256 amount);
    event ReceiptRedeemed(bytes32 indexed receiptId, address indexed owner, address mToken, uint256 amount);
    event ReceiptLocked(bytes32 indexed receiptId);
    event ReceiptUnlocked(bytes32 indexed receiptId);

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    address private immutable i_IntentBook;
    MTokenManager private s_mTokenManager;
    mapping(bytes32 receiptId => Receipt) private s_receipts;
    mapping(bytes32 receiptId => bool locked) private s_lockedReceipts;
    mapping(address owner => bytes32[] receipts) private s_receiptsByOwner;

    constructor(address intentBook, address mTokenManagerAddress) {
        i_IntentBook = intentBook;
        s_mTokenManager = MTokenManager(mTokenManagerAddress);
    }

    function redeem(bytes32 receiptId) public {
        if (s_lockedReceipts[receiptId]) {
            revert ReceiptAlreadyLocked();
        }
        s_lockedReceipts[receiptId] = true;
        Receipt memory receipt = s_receipts[receiptId];
        s_mTokenManager.withdrawMTokensFromReceipt(receiptId, receipt.owner, receipt.mToken, receipt.mTokenAmount);
    }

    function createReceipt(address owner, address mToken, uint256 amount, bytes32 intentHash)
        public
        returns (bytes32 receiptId)
    {
        if (msg.sender != i_IntentBook) {
            revert UnauthorizedReceiptIssuance();
        }

        receiptId = keccak256(abi.encode(owner, mToken, amount, block.number));
        s_receipts[receiptId] = Receipt(mToken, amount, owner, intentHash);
        s_receiptsByOwner[owner].push(receiptId);

        emit ReceiptCreated(receiptId, owner, mToken, amount);
    }

    function lockReceipt(bytes32 receiptId) public {
        if (msg.sender != i_IntentBook) {
            revert UnauthorizedLockOperation();
        }
        if (s_lockedReceipts[receiptId]) {
            revert ReceiptAlreadyLocked();
        }
        s_lockedReceipts[receiptId] = true;
        emit ReceiptLocked(receiptId);
    }

    function unlockReceipt(bytes32 receiptId) public {
        if (msg.sender != i_IntentBook) {
            revert UnauthorizedLockOperation();
        }
        if (!s_lockedReceipts[receiptId]) {
            revert ReceiptNotLocked();
        }
        s_lockedReceipts[receiptId] = false;
        emit ReceiptUnlocked(receiptId);
    }

    function getReceipt(bytes32 receiptId) public view returns (Receipt memory) {
        return s_receipts[receiptId];
    }

    function getReceiptsByOwner(address owner) public view returns (bytes32[] memory) {
        return s_receiptsByOwner[owner];
    }

    function removeReceiptFromOwner(address owner, bytes32 receiptId) internal {
        bytes32[] storage ownerReceipts = s_receiptsByOwner[owner];
        for (uint256 i = 0; i < ownerReceipts.length; i++) {
            if (ownerReceipts[i] == receiptId) {
                ownerReceipts[i] = ownerReceipts[ownerReceipts.length - 1];
                ownerReceipts.pop();
                break;
            }
        }
    }
}
