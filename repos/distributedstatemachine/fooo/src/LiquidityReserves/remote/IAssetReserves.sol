pragma solidity ^0.8.0;

import "../../InterchainMessaging/Token.sol";
import "../../Tokens/IERC20MintableBurnable.sol";

interface IAssetReserves {
    //------------EVENTS------------//
    event LockOrBurn(
        address indexed sender,
        Token[] tokens
    );
    event MintOrUnlock(
        address indexed target,
        Token[] mirrorTokens
    );

    event AssetAddedToWhitelist(
        address indexed asset
    );
    event AssetRemovedFromWhitelist(
        address indexed asset
    );
    event MirrorTokenSet(
        address indexed token,
        address indexed mirrorToken
    );

    //------------FUNCTIONS------------//
    function kai() external view returns (IERC20MintableBurnable);
    function lockOrBurn(
        address sender,
        Token[] calldata tokens
    ) external;

    function mintOrUnlock(
        address target,
        Token[] calldata mirrorTokens
    ) external;
}