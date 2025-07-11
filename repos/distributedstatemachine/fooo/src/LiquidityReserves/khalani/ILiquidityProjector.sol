pragma solidity ^0.8.0;

import "../../InterchainMessaging/Token.sol";
import "../../InterchainMessaging/Errors.sol";

interface ILiquidityProjector {

    //------------EVENTS------------//
    event LockOrBurn(
        address indexed sender,
        Token[] tokens
    );
    event MintOrUnlock(
        uint256 indexed chainId,
        address indexed target,
        Token[] tokens
    );

    event MirrorTokenSet(
        uint256 indexed chainId,
        address indexed token,
        address indexed mirrorToken
    );

    function kai() external view returns (address);

    function lockOrBurn(
        uint256 chainId,
        address sender,
        Token[] memory tokens
    ) external returns (Token[] memory sourceTokens);

    function mintOrUnlock(
        uint256 chainId,
        address target,
        Token[] calldata tokens
    ) external returns (Token[] memory);

}