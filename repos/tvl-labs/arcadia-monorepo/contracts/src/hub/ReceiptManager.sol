// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Receipt} from "../types/Receipt.sol";
import {MTokenManager} from "./MTokenManager.sol";
import {AccessManaged} from "@oz5/contracts/access/manager/AccessManaged.sol";

contract ReceiptManager is AccessManaged {
    // ***************** //
    // **** ERRORS **** //
    // ***************** //
    error ReceiptNotFound();
    // aderyn-ignore-next-line(unused-error)
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
    // aderyn-ignore-next-line(state-variable-could-be-immutable)
    MTokenManager private s_mTokenManager;
    uint256 private s_receiptNonce;
    mapping(bytes32 receiptId => Receipt) private s_receipts;
    mapping(bytes32 receiptId => bool locked) private s_lockedReceipts;
    mapping(address owner => bytes32[] receipts) private s_receiptsByOwner;

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    constructor(address intentBook, address mTokenManagerAddress, address accessManager) AccessManaged(accessManager) {
        require(intentBook != address(0), "IntentBook address cannot be 0");
        require(mTokenManagerAddress != address(0), "MTokenManager address cannot be 0");

        i_IntentBook = intentBook;
        s_mTokenManager = MTokenManager(mTokenManagerAddress);
    }

    // ***************** //
    // **** PUBLIC **** //
    // ***************** //

    // aderyn-ignore-next-line(unused-public-function)
    function redeem(bytes32 receiptId) public {
        if (s_lockedReceipts[receiptId]) {
            // To get the hex signature of this error using cast:
            // cast sig "ReceiptAlreadyLocked()"
            // Which returns: 0x1f2a2005
            revert ReceiptAlreadyLocked();
        }
        s_lockedReceipts[receiptId] = true;
        Receipt memory receipt = s_receipts[receiptId];
        if (receipt.owner == address(0)) {
            revert ReceiptNotFound();
        }
        emit ReceiptRedeemed(receiptId, receipt.owner, receipt.mToken, receipt.mTokenAmount);
        s_mTokenManager.withdrawMTokensFromReceipt(receiptId, receipt.owner, receipt.mToken, receipt.mTokenAmount);
    }

    // aderyn-ignore-next-line(unused-public-function)
    function createReceipt(address owner, address mToken, uint256 amount, bytes32 intentHash)
        public
        returns (bytes32 receiptId)
    {
        if (msg.sender != i_IntentBook) {
            revert UnauthorizedReceiptIssuance();
        }

        receiptId = keccak256(abi.encode(owner, mToken, amount, block.number, s_receiptNonce++));
        s_receipts[receiptId] = Receipt(mToken, amount, owner, intentHash);
        s_receiptsByOwner[owner].push(receiptId);

        emit ReceiptCreated(receiptId, owner, mToken, amount);
    }

    // aderyn-ignore-next-line(unused-public-function)
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

    // aderyn-ignore-next-line(unused-public-function)
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

    // ***************** //
    // **** INTERNAL **** //
    // ***************** //

    // aderyn-ignore-next-line(unused-internal-function)
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

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    // aderyn-ignore-next-line(unused-public-function)
    function getReceipt(bytes32 receiptId) public view returns (Receipt memory) {
        return s_receipts[receiptId];
    }

    // aderyn-ignore-next-line(unused-public-function)
    function getReceiptsByOwner(address owner) public view returns (bytes32[] memory) {
        return s_receiptsByOwner[owner];
    }

    // aderyn-ignore-next-line(unused-public-function)
    function getReceiptNonce() public view returns (uint256) {
        return s_receiptNonce;
    }
}
