// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

struct XChainEvent {
    address publisher;
    uint256 originChainId;
    bytes32 eventHash;
    bytes eventData;
    uint256 eventNonce;
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
bytes32 constant DEPOSIT_EVENT = keccak256("AssetReserveDeposit");
