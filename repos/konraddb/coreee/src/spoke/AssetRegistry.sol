// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract AssetRegistry is Ownable {
    using SafeERC20 for IERC20;

    error AssetRegistry__InavlidAssetId();
    error AssetRegistry__AssetAlreadyAdded();
    error AssetRegistry__AssetNotWhitelisted();

    event AssetAdded(address indexed token);
    event AssetRemoved(address indexed token);

    mapping(address token => bool enabled) public registry;

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

        registry[asset] = true;
    }

    function removeAsset(address asset) external onlyOwner {
        if (asset == address(0)) {
            revert AssetRegistry__InavlidAssetId();
        }
        if (!registry[asset]) {
            revert AssetRegistry__AssetNotWhitelisted();
        }
        registry[asset] = false;
    }

    function isSupportedAsset(address asset) public view returns (bool) {
        return registry[asset];
    }
}
