// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MToken} from "../hub/MToken.sol";
import {MTokenInfo} from "../types/MToken.sol";

contract MTokenRegistry {
    mapping(address mToken => MTokenInfo) private s_mTokenRegistry;

    error MTokenRegistry__UnsupportedMToken();
    error MTokenRegistry__MTokenAlreadyExists();
    error MTokenRegistry__MTokenNotFound();
    error MTokenRegistry__MTokenPaused();
    error MTokenRegistry__MTokenDestroyed();

    event MTokenCreated(address indexed mToken, string symbol, string name, address spokeAddr, uint32 spokeChainId);
    event MTokenPaused(address indexed mToken);
    event MTokenUnpaused(address indexed mToken);
    event MTokenDestroyed(address indexed mToken);

    address private immutable mTokenManager;

    constructor(address _mTokenManager) {
        mTokenManager = _mTokenManager;
    }

    function createMToken(
        string memory symbol,
        string memory name,
        address spokeAddr,
        uint32 spokeChainId
    ) external returns (address) {
        address newMToken = address(new MToken(symbol, name, spokeAddr, spokeChainId, mTokenManager));
        if (s_mTokenRegistry[newMToken].mTokenAddress != address(0)) {
            revert MTokenRegistry__MTokenAlreadyExists();
        }

        s_mTokenRegistry[newMToken] = MTokenInfo(newMToken, false, false);
        emit MTokenCreated(newMToken, symbol, name, spokeAddr, spokeChainId);

        return newMToken;
    }

    function pauseMToken(address mToken) external {
        MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
        if (mTokenInfo.mTokenAddress == address(0)) {
            revert MTokenRegistry__MTokenNotFound();
        }
        if (mTokenInfo.isDestroyed) {
            revert MTokenRegistry__MTokenDestroyed();
        }
        mTokenInfo.isPaused = true;
        emit MTokenPaused(mToken);
    }

    function unpauseMToken(address mToken) external {
        MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
        if (mTokenInfo.mTokenAddress == address(0)) {
            revert MTokenRegistry__MTokenNotFound();
        }
        if (mTokenInfo.isDestroyed) {
            revert MTokenRegistry__MTokenDestroyed();
        }
        mTokenInfo.isPaused = false;
        emit MTokenUnpaused(mToken);
    }

    function destroyMToken(address mToken) external {
        MTokenInfo storage mTokenInfo = s_mTokenRegistry[mToken];
        if (mTokenInfo.mTokenAddress == address(0)) {
            revert MTokenRegistry__MTokenNotFound();
        }
        mTokenInfo.isDestroyed = true;
        emit MTokenDestroyed(mToken);
    }

    function getMTokenInfo(address mToken) external view returns (MTokenInfo memory) {
        return s_mTokenRegistry[mToken];
    }

    function checkValidMToken(address mToken) external view {
        MTokenInfo memory mTokenInfo = s_mTokenRegistry[mToken];
        if (mTokenInfo.mTokenAddress == address(0)) {
            revert MTokenRegistry__UnsupportedMToken();
        }
        if (mTokenInfo.isPaused) {
            revert MTokenRegistry__MTokenPaused();
        }
        if (mTokenInfo.isDestroyed) {
            revert MTokenRegistry__MTokenDestroyed();
        }
    }
}
