pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../Tokens/IERC20MintableBurnable.sol";
import "../../../util/Owned.sol";
import "../../../InterchainMessaging/Errors.sol";
import "../../LibScaling.sol";
import "../ILiquidityAggregator.sol";

contract KaiLiquidityAggregator is ILiquidityAggregator, Owned {

    event WhiteListedTokenAdded(
        address indexed asset
    );

    event WhiteListedTokenRemoved(
        address indexed asset
    );

    mapping(address => bool) whiteListedTokens;
    address public immutable kai;

    constructor(address _kai) Owned(msg.sender){kai = _kai;}

    /**
     * @dev Adds an asset to the whitelist
     * @param asset the address of the asset to whitelist
     */
    function addWhiteListedAsset(address asset) external onlyOwner {
        whiteListedTokens[asset] = true;
        emit WhiteListedTokenAdded(asset);
    }

    /**
    * @dev Removes an asset from the whitelist
    * @param asset the address of the asset to remove from whitelist
    */
    function removeWhiteListedAddress(address asset) external onlyOwner {
        whiteListedTokens[asset] = false;
        emit WhiteListedTokenRemoved(asset);
    }

    /**
    * @dev Allows the deposit of a whitelisted token and mints Kai in return
    * @param token the token to deposit
    * @param receiver the address that will receive the minted Kai tokens
    * @return the token data for the deposited token
    */
    function deposit(Token memory token, address receiver) external override returns (Token memory){
        if(!whiteListedTokens[token.tokenAddress]){
            revert AssetNotWhiteListed(token.tokenAddress);
        }
        SafeERC20.safeTransferFrom(IERC20(token.tokenAddress),msg.sender,address(this),token.amount);
        emit Deposit(msg.sender, receiver, token);
        token.amount = LibScaling._computeScalingFactor(token.tokenAddress, token.amount);
        IERC20MintableBurnable(kai).mint(receiver, token.amount);
        token.tokenAddress = kai;
        return token;
    }
}