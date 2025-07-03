// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IComposableStablePool {
   function getAmplificationParameter()
        external
        view
        returns (
            uint256 value,
            bool isUpdating,
            uint256 precision
        );

    function getScalingFactors() external view returns (uint256[] memory);

    function getBptIndex() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function getSwapFeePercentage() external view returns (uint256);
    
}
