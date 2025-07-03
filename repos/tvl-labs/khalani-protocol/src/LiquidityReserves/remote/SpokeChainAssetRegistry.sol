pragma solidity ^0.8.4;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

//Contract to manage the whitelisted tokens in asset reserves
abstract contract SpokeChainAssetRegistry is Ownable{
    using SafeERC20 for IERC20;

    //mapping to store the whitelisted tokens
    mapping(address => bool) public assetWhiteList;

    //event to emit when a token is added to the whitelist
    event AssetAdded(address indexed asset);

    //event to emit when a token is removed from the whitelist
    event AssetRemoved(address indexed asset);

    //function to add a token to the whitelist, can be called only by the owner
    function addAsset(address asset) external onlyOwner {
        require(asset != address(0), "AssetReserves: Invalid asset address");
        require(!assetWhiteList[asset], "AssetReserves: Asset already whitelisted");
        assetWhiteList[asset] = true;
        emit AssetAdded(asset);
    }

    //function to remove a token from the whitelist, can be called only by the owner
    function removeAsset(address asset) external onlyOwner {
        require(asset != address(0), "AssetReserves: Invalid asset address");
        require(assetWhiteList[asset], "AssetReserves: Asset not whitelisted");
        assetWhiteList[asset] = false;
        emit AssetRemoved(asset);
    }
}