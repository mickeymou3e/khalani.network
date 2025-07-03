// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {ReceiptManager} from "./ReceiptManager.sol";
// import {MToken} from "./MToken.sol";
// import {Receipt} from "../types/Receipt.sol";
// import {AIPEventPublisher} from "../common/AIPEventPublisher.sol";
// import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
// import {WITHDRAWAL_EVENT} from "../types/Events.sol";
// import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import {Intent} from "../types/Intent.sol";

// struct ResourceBalance {
//     address mToken;
//     uint256 balance;
// }

// struct MTokenInfo {
//     address mTokenAddress;
//     bool isPaused;
//     bool isDestroyed;
// }

// contract MTokenManager is Ownable {
//     using SafeERC20 for IERC20;

//     error MTokenManager__UnauthorizedCaller();
//     error MTokenManager__UserBalanceNotEnough();
//     error MTokenManager__IntentBalanceAlreadyDeposited();
//     error MTokenManager__IntentBalanceNotEnough();
//     error MTokenManager__ReceiptAndIntentTokensDoNotMatch();
//     error MTokenManager__UnsupportedMToken();
//     error MTokenManager__MTokenAlreadyExists();
//     error MTokenManager__MTokenNotFound();
//     error MTokenManager__MTokenPaused();
//     error MTokenManager__MTokenDestroyed();

//     event MTokenMinted(address indexed mToken, bytes32 indexed user, uint256 indexed amount);
//     event MTokenBurned(address indexed mToken, bytes32 indexed user, uint256 indexed amount);
//     event MTokenCreated(address indexed mToken, string symbol, string name, address spokeAddr, uint32 spokeChainId);
//     event MTokenPaused(address indexed mToken);
//     event MTokenUnpaused(address indexed mToken);
//     event MTokenDestroyed(address indexed mToken);
//     event AuthorizedMinterAdded(address indexed minter);
//     event AuthorizedMinterRemoved(address indexed minter);

//     address private s_receiptManager;
//     address private s_intentBook;
//     AIPEventPublisher private s_aipEventPublisher;
//     mapping(address mToken => MTokenInfo) private s_mTokenRegistry;
//     mapping(bytes32 user => mapping(address mToken => uint256 balance)) private s_userBalances;
//     mapping(bytes32 intentId => ResourceBalance balance) private s_intentBalances;
//     mapping(address minter => bool authorized) private s_authorizedMinters;

//     constructor(address _aipEventPublisher) Ownable() {
//         s_authorizedMinters[msg.sender] = true;
//         s_aipEventPublisher = AIPEventPublisher(_aipEventPublisher);
//     }

//     function redeemReceipt(Receipt memory receipt) external {
//         if (msg.sender != s_receiptManager) {
//             revert MTokenManager__UnauthorizedCaller();
//         }

//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[receipt.mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         ResourceBalance memory receiptIntentBal = s_intentBalances[receipt.intentHash];

//         if (receiptIntentBal.balance < receipt.mTokenAmount) {
//             revert MTokenManager__IntentBalanceNotEnough();
//         }
//         if (receiptIntentBal.mToken != receipt.mToken) {
//             revert MTokenManager__ReceiptAndIntentTokensDoNotMatch();
//         }

//         s_intentBalances[receipt.intentHash] =
//             ResourceBalance(receipt.mToken, (receiptIntentBal.balance - receipt.mTokenAmount));
//         s_userBalances[TypeCasts.addressToBytes32(receipt.owner)][receipt.mToken] += receipt.mTokenAmount;

//         MToken(receipt.mToken).transferFromReceipt(receipt.intentHash, receipt.owner, receipt.mTokenAmount);
//     }

//     function transferToReceipt(bytes32 receiptId, address mToken, uint256 amount) public {
//         if (msg.sender != s_intentBook) {
//             revert MTokenManager__UnauthorizedCaller();
//         }

//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }

//         // Transfer the MTokens to the receipt
//         MToken(mToken).mintToReceipt(receiptId, address(this), amount);
//     }

//     function lockTokensInIntent(bytes32 intentId, address author, address mToken, uint256 balance) external {
//         if (msg.sender != s_intentBook) {
//             revert MTokenManager__UnauthorizedCaller();
//         }

//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         if (s_userBalances[TypeCasts.addressToBytes32(author)][mToken] < balance) {
//             revert MTokenManager__UserBalanceNotEnough();
//         }

//         if (s_intentBalances[intentId].mToken != address(0)) {
//             revert MTokenManager__IntentBalanceAlreadyDeposited();
//         }
//         s_userBalances[TypeCasts.addressToBytes32(author)][mToken] -= balance;
//         s_intentBalances[intentId] = ResourceBalance(mToken, balance);

//         MToken(mToken).transferFromIntent(intentId, address(this), balance);
//     }

//     function setReceiptManager(address mgr) external onlyOwner {
//         s_receiptManager = mgr;
//     }

//     function setIntentBook(address intentBook) external onlyOwner {
//         s_intentBook = intentBook;
//     }

//     function createMToken(string memory symbol, string memory name, address spokeAddr, uint32 spokeChainId)
//         external
//         onlyOwner
//         returns (address)
//     {
//         address newMToken = address(new MToken(symbol, name, spokeAddr, spokeChainId));
//         if (s_mTokenRegistry[newMToken].mTokenAddress != address(0)) {
//             revert MTokenManager__MTokenAlreadyExists();
//         }
//         s_mTokenRegistry[newMToken] = MTokenInfo(newMToken, false, false);
//         emit MTokenCreated(newMToken, symbol, name, spokeAddr, spokeChainId);
//         return newMToken;
//     }

//     function pauseMToken(address mToken) external onlyOwner {
//         MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__MTokenNotFound();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }
//         mTokenInfo.isPaused = true;
//         emit MTokenPaused(mToken);
//     }

//     function unpauseMToken(address mToken) external onlyOwner {
//         MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__MTokenNotFound();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }
//         mTokenInfo.isPaused = false;
//         emit MTokenUnpaused(mToken);
//     }

//     function destroyMToken(address mToken) external onlyOwner {
//         MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__MTokenNotFound();
//         }
//         mTokenInfo.isDestroyed = true;
//         emit MTokenDestroyed(mToken);
//     }

//     function mintMToken(address to, address mToken, uint256 amount) public {
//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         if (!s_authorizedMinters[msg.sender]) {
//             revert MTokenManager__UnauthorizedCaller();
//         }

//         emit MTokenMinted(mToken, TypeCasts.addressToBytes32(to), amount);

//         MToken(mToken).mint(to, amount);
//         s_userBalances[TypeCasts.addressToBytes32(to)][mToken] += amount;
//     }

//     function mintMTokenToIntent(bytes32 intentId, address mToken, uint256 amount) public {
//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         if (!s_authorizedMinters[msg.sender]) {
//             revert MTokenManager__UnauthorizedCaller();
//         }

//         emit MTokenMinted(mToken, TypeCasts.addressToBytes32(address(this)), amount);

//         MToken(mToken).mintToIntent(intentId, address(this), amount);
//         s_intentBalances[intentId] = ResourceBalance(mToken, amount);
//     }

//     function mintMTokenToReceipt(bytes32 receiptId, address mToken, uint256 amount) public {
//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         emit MTokenMinted(mToken, receiptId, amount);

//         // Mint the tokens to the receipt, using the receiptId for tracking
//         MToken(mToken).mintToReceipt(receiptId, address(this), amount);

//         // Use s_userBalances with receiptId directly
//         s_userBalances[receiptId][mToken] += amount;
//     }

//     function burnMToken(address from, address mToken, uint256 amount) public {
//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }
//         if (mTokenInfo.isPaused) {
//             revert MTokenManager__MTokenPaused();
//         }
//         if (mTokenInfo.isDestroyed) {
//             revert MTokenManager__MTokenDestroyed();
//         }

//         if (s_userBalances[TypeCasts.addressToBytes32(from)][mToken] < amount) {
//             revert MTokenManager__UserBalanceNotEnough();
//         }

//         emit MTokenBurned(mToken, TypeCasts.addressToBytes32(from), amount);

//         MToken(mToken).burnFrom(from, amount);
//         s_userBalances[TypeCasts.addressToBytes32(from)][mToken] -= amount;

//         // Trigger cross-chain event for withdrawal
//         bytes memory eventData = abi.encode(from, mToken, amount);
//         s_aipEventPublisher.publishEvent(eventData, WITHDRAWAL_EVENT);
//     }

//     function depositToIntent(
//         bytes32 intentId,
//         Intent memory intent
//     ) external {
//         MTokenInfo memory mTokenInfo = s_mTokenRegistry[intent.srcMToken];
//         if (mTokenInfo.mTokenAddress == address(0)) {
//             revert MTokenManager__UnsupportedMToken();
//         }

//         // Transfer tokens from the author to the intent using the signature for authorization
//         MToken(intent.srcMToken).transferToIntent(intentId, address(this), intent);

//         // Record the intent balance
//         s_intentBalances[intentId] = ResourceBalance(intent.srcMToken, intent.srcAmount);
//     }

//     function balanceOfIntent(bytes32 intentId) public view returns (uint256) {
//         return s_intentBalances[intentId].balance;
//     }

//     function addAuthorizedMinter(address minter) external onlyOwner {
//         s_authorizedMinters[minter] = true;
//         emit AuthorizedMinterAdded(minter);
//     }

//     function removeAuthorizedMinter(address minter) external onlyOwner {
//         s_authorizedMinters[minter] = false;
//         emit AuthorizedMinterRemoved(minter);
//     }

//     function isAuthorizedMinter(address minter) external view returns (bool) {
//         return s_authorizedMinters[minter];
//     }
// }
