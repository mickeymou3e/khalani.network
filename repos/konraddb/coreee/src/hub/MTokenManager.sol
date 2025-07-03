// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AuthorizationManager} from "../modules/AuthorizationManager.sol";
import {MTokenRegistry} from "../modules/MTokenRegistry.sol";
import {MToken} from "./MToken.sol";
import {Receipt} from "../types/Receipt.sol";
import {SignedIntent, Intent} from "../types/Intent.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {MTokenInfo} from "../types/MToken.sol";
import {AIPEventPublisher} from "../common/AIPEventPublisher.sol";
import {WITHDRAWAL_EVENT} from "../types/Events.sol";
import {SignatureLib} from "../libraries/SignatureLib.sol";
import {IntentLib} from "../libraries/IntentLib.sol";

struct ResourceBalance {
    address mToken;
    uint256 balance;
}

contract MTokenManager is AuthorizationManager {
    // ***************** //
    // **** ERRORS ***** //
    // ***************** //
    error UnauthorizedCaller();
    error InsufficientAllowance();
    error UserBalanceNotEnough();
    error InsufficientIntentBalance(uint256 intentBalance, uint256 amount);
    error ReceiptAndIntentTokensDoNotMatch();
    error UnsupportedMToken();
    error MTokenPaused();
    error MTokenDestroyed();
    error CallerNotIntentBook();
    error InvalidSignature();
    error AuthorMismatch();
    error IntentIDMismatch();
    error InsufficientMTokens();

    // ***************** //
    // **** EVENTS ***** //
    // ***************** //
    event MTokenMinted(address indexed mToken, bytes32 indexed user, uint256 amount);
    event MTokenBurned(address indexed mToken, bytes32 indexed user, uint256 amount);
    event MTokenTransferred(address indexed mToken, bytes32 indexed fromId, bytes32 indexed toId, uint256 amount);
    event Approval(address indexed mToken, bytes32 indexed owner, bytes32 indexed spender, uint256 amount);

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    MTokenRegistry private s_tokenRegistry;
    AIPEventPublisher private s_aipEventPublisher;

    // Mapping from owner (address or resource ID) to mToken to balance
    mapping(bytes32 => mapping(address => uint256)) private s_userBalances;

    // Mapping from owner to spender to mToken to allowance
    mapping(bytes32 => mapping(bytes32 => mapping(address => uint256))) private s_allowances;

    // Total supply per mToken
    mapping(address => uint256) private s_totalSupply;

    mapping(bytes32 => ResourceBalance) private s_intentBalances;
    address private s_intentBook;
    address private s_receiptManager;

    constructor(address _aipEventPublisher) AuthorizationManager() {
        s_aipEventPublisher = AIPEventPublisher(_aipEventPublisher);
        addAuthorizedMinter(msg.sender);
    }

    // ***************** //
    // *** MODIFIERS *** //
    // ***************** //
    modifier onlyMToken(address mToken) {
        if (msg.sender != mToken) {
            revert UnauthorizedCaller();
        }
        _;
    }

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    // Administrative functions
    function setIntentBook(address _intentBook) external onlyOwner {
        // Add proper access control
        s_intentBook = _intentBook;
    }

    function setReceiptManager(address _receiptManager) external onlyOwner {
        // Add proper access control
        s_receiptManager = _receiptManager;
    }

    function setTokenRegistry(address _tokenRegistry) external onlyOwner {
        require(address(s_tokenRegistry) == address(0), "Token registry already set");
        s_tokenRegistry = MTokenRegistry(_tokenRegistry);
    }

    function totalSupply(address mToken) external view returns (uint256) {
        return s_totalSupply[mToken];
    }

    function getBalanceOfUser(address user, address mToken) external view returns (uint256) {
        bytes32 userId = TypeCasts.addressToBytes32(user);
        return s_userBalances[userId][mToken];
    }

    function getBalanceOfResource(bytes32 resourceId, address mToken) external view returns (uint256) {
        return s_userBalances[resourceId][mToken];
    }

    function getAllowance(address owner, address spender, address mToken) external view returns (uint256) {
        bytes32 ownerId = TypeCasts.addressToBytes32(owner);
        bytes32 spenderId = TypeCasts.addressToBytes32(spender);
        return s_allowances[ownerId][spenderId][mToken];
    }

    function mintMToken(address to, address mToken, uint256 amount) external {
        if (msg.sender != mToken) {
            checkAuthorizedMinter(msg.sender);
        }
        _validateMToken(mToken);

        bytes32 toId = TypeCasts.addressToBytes32(to);
        s_userBalances[toId][mToken] += amount;
        s_totalSupply[mToken] += amount;

        emit MTokenMinted(mToken, toId, amount);
    }

    function burnMToken(address operator, address from, uint256 amount, address mToken) external onlyMToken(mToken) {
        _validateMToken(mToken);

        bytes32 operatorId = TypeCasts.addressToBytes32(operator);
        bytes32 fromId = TypeCasts.addressToBytes32(from);

        if (operator != from) {
            // If operator is not the owner, check allowance
            uint256 currentAllowance = s_allowances[fromId][operatorId][mToken];
            if (currentAllowance < amount) {
                revert InsufficientAllowance();
            }
            s_allowances[fromId][operatorId][mToken] = currentAllowance - amount;
        }

        uint256 balance = s_userBalances[fromId][mToken];
        if (balance < amount) {
            revert InsufficientMTokens();
        }
        s_userBalances[fromId][mToken] = balance - amount;
        s_totalSupply[mToken] -= amount;

        emit MTokenBurned(mToken, fromId, amount);

        // Trigger cross-chain event for withdrawal
        bytes memory eventData = abi.encode(from, mToken, amount);
        s_aipEventPublisher.publishEvent(eventData, WITHDRAWAL_EVENT);
    }

    function mTokenTransfer(address from, address to, uint256 amount, address mToken) external onlyMToken(mToken) {
        _validateMToken(mToken);

        bytes32 fromId = TypeCasts.addressToBytes32(from);
        bytes32 toId = TypeCasts.addressToBytes32(to);
        _transfer(fromId, toId, amount, mToken);
    }

    function mTokenTransferFrom(address spender, address from, address to, uint256 amount, address mToken)
        external
        onlyMToken(mToken)
    {
        _validateMToken(mToken);

        bytes32 spenderId = TypeCasts.addressToBytes32(spender);
        bytes32 fromId = TypeCasts.addressToBytes32(from);
        bytes32 toId = TypeCasts.addressToBytes32(to);

        uint256 currentAllowance = s_allowances[fromId][spenderId][mToken];
        if (currentAllowance < amount) {
            revert InsufficientAllowance();
        }

        s_allowances[fromId][spenderId][mToken] = currentAllowance - amount;
        _transfer(fromId, toId, amount, mToken);
    }

    function mTokenApprove(address owner, address spender, uint256 amount, address mToken)
        external
        onlyMToken(mToken)
    {
        bytes32 ownerId = TypeCasts.addressToBytes32(owner);
        bytes32 spenderId = TypeCasts.addressToBytes32(spender);

        s_allowances[ownerId][spenderId][mToken] = amount;

        emit Approval(mToken, ownerId, spenderId, amount);
    }

    function _transfer(bytes32 fromId, bytes32 toId, uint256 amount, address mToken) internal {
        uint256 fromBalance = s_userBalances[fromId][mToken];
        if (fromBalance < amount) {
            revert InsufficientMTokens();
        }

        s_userBalances[fromId][mToken] = fromBalance - amount;
        s_userBalances[toId][mToken] += amount;

        emit MTokenTransferred(mToken, fromId, toId, amount);
    }

    function getIntentBalance(bytes32 intentId) external view returns (uint256) {
        return s_intentBalances[intentId].balance;
    }

    function transferMTokensToIntent(
        address from,
        bytes32 intentId,
        address mToken,
        uint256 amount,
        SignedIntent memory signedIntent
    ) external {
        if (msg.sender != s_intentBook) {
            revert CallerNotIntentBook();
        }
        if (!SignatureLib.verifyIntentSignature(signedIntent, s_intentBook)) {
            revert InvalidSignature();
        }
        if (signedIntent.intent.author != from) {
            revert AuthorMismatch();
        }

        bytes32 computedIntentId = IntentLib.hashIntent(signedIntent.intent);
        if (computedIntentId != intentId) {
            revert IntentIDMismatch();
        }

        bytes32 fromId = TypeCasts.addressToBytes32(from);
        if (s_userBalances[fromId][mToken] < amount) {
            revert InsufficientMTokens();
        }

        s_userBalances[fromId][mToken] -= amount;
        ResourceBalance storage intentBalance = s_intentBalances[intentId];
        intentBalance.mToken = mToken;
        intentBalance.balance += amount;

        emit MTokenTransferred(mToken, fromId, intentId, amount);
    }

    function transferMTokensToReceipt(bytes32 intentId, bytes32 receiptId, address mToken, uint256 amount) public {
        s_tokenRegistry.checkValidMToken(mToken);
        checkAuthorizedMinter(msg.sender);

        ResourceBalance storage intentBalance = s_intentBalances[intentId];
        if (intentBalance.mToken != mToken || intentBalance.balance < amount) {
            revert InsufficientIntentBalance(intentBalance.balance, amount);
        }

        intentBalance.balance -= amount;
        s_userBalances[receiptId][mToken] += amount;

        emit MTokenTransferred(mToken, intentId, receiptId, amount);
    }

    // Validation function
    function _validateMToken(address mToken) private view {
        MTokenInfo memory mTokenInfo = s_tokenRegistry.getMTokenInfo(mToken);

        if (mTokenInfo.mTokenAddress == address(0)) {
            revert UnsupportedMToken();
        }
        if (mTokenInfo.isPaused) {
            revert MTokenPaused();
        }
        if (mTokenInfo.isDestroyed) {
            revert MTokenDestroyed();
        }
    }
}
