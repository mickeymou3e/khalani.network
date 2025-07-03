// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

abstract contract AssetRegistry is Ownable {
    // ***************** //
    // *** ERRORS *** //
    // ***************** //
    error AssetRegistry__InvalidAssetId();
    error AssetRegistry__AssetAlreadyAdded();
    error AssetRegistry__AssetNotWhitelisted();

    // ***************** //
    // *** EVENTS *** //
    // ***************** //

    event AssetAdded(address indexed token, uint8 decimals);
    event AssetRemoved(address indexed token);

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    mapping(address => bool) public registry;
    mapping(address => uint8) public tokenDecimals;

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    constructor(address admin) Ownable() {
        _transferOwnership(admin);
    }

    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //
    function addAsset(address asset) external onlyOwner {
        if (asset == address(0)) {
            revert AssetRegistry__InvalidAssetId();
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
            revert AssetRegistry__InvalidAssetId();
        }
        if (!registry[asset]) {
            revert AssetRegistry__AssetNotWhitelisted();
        }
        registry[asset] = false;
        delete tokenDecimals[asset];

        emit AssetRemoved(asset);
    }

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    function isSupportedAsset(address asset) public view returns (bool) {
        return registry[asset];
    }
}
