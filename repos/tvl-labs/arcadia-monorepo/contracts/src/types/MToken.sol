// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

struct MTokenInfo {
    address mTokenAddress;
    bool isPaused;
    bool isDestroyed;
}

struct SpokeTokenInfo {
    address token;
    uint32 chainId;
}
