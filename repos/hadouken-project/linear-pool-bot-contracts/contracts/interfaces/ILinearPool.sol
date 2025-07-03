pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./IERC20.sol";

interface ILinearPool {
    /**
     * @dev Returns the Pool's main token.
     */
    function getMainToken() external view returns (IERC20);

    /**
     * @dev Returns the Pool's wrapped token.
     */
    function getWrappedToken() external view returns (IERC20);

    /**
     * @dev Returns the index of the Pool's BPT in the Pool tokens array (as returned by IVault.getPoolTokens).
     */
    function getBptIndex() external view returns (uint256);

    /**
     * @dev Returns the index of the Pool's main token in the Pool tokens array (as returned by IVault.getPoolTokens).
     */
    function getMainIndex() external view returns (uint256);

    /**
     * @dev Returns the index of the Pool's wrapped token in the Pool tokens array (as returned by
     * IVault.getPoolTokens).
     */
    function getWrappedIndex() external view returns (uint256);

    /**
     * @dev Returns the Pool's targets for the main token balance. These values have had the main token's scaling
     * factor applied to them.
     */
    function getTargets() external view returns (uint256 lowerTarget, uint256 upperTarget);
}