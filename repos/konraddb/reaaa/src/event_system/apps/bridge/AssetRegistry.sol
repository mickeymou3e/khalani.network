// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

abstract contract AssetRegistry is Ownable {
    error AssetRegistry__InavlidAssetId();
    error AssetRegistry__AssetAlreadyAdded();
    error AssetRegistry__AssetNotWhitelisted();

    event AssetAdded(address indexed token, uint8 decimals);
    event AssetRemoved(address indexed token);

    mapping(address => bool) public registry;
    mapping(address => uint8) public tokenDecimals;

    constructor(address admin) Ownable() {
        _transferOwnership(admin);
    }

    function addAsset(address asset) external onlyOwner {
        if (asset == address(0)) {
            revert AssetRegistry__InavlidAssetId();
        }

        if (registry[asset]) {
            revert AssetRegistry__AssetAlreadyAdded();
        }

        uint8 decimals = IERC20Metadata(asset).decimals();
        registry[asset] = true;
        tokenDecimals[asset] = decimals;

        emit AssetAdded(asset, decimals);
    }

    function removeAsset(address asset) external onlyOwner {
        if (asset == address(0)) {
            revert AssetRegistry__InavlidAssetId();
        }
        if (!registry[asset]) {
            revert AssetRegistry__AssetNotWhitelisted();
        }
        registry[asset] = false;
        delete tokenDecimals[asset];

        emit AssetRemoved(asset);
    }

    function isSupportedAsset(address asset) public view returns (bool) {
        return registry[asset];
    }
}
