// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct XChainEvent {
    address publisher;
    uint256 originChainId;
    bytes32 eventHash;
    bytes eventData;
}

// Application specific event
struct XChainAppEvent {
    address publisher;
    uint256 originChainId;
    bytes32 applicationId;
    bytes32 eventHash;
    bytes eventData;
}

struct AssetReserveDeposit {
    address token;
    uint256 amount;
    address depositor;
}

struct MTokenWithdrawal {
    address token;
    uint256 amount;
    address withdrawer;
}

bytes32 constant ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH =
    keccak256("AssetReserveDeposit(address token, uint256 amount, address depositor)");
bytes32 constant MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH =
    keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");
bytes32 constant WITHDRAWAL_EVENT = keccak256("MTokenWithdrawal");
bytes32 constant DEPOSIT_EVENT = keccak256("AssetReserveDeposit");
