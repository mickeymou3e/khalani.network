   // SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IWeightedPool {
    function getInvariant() external view returns (uint256);

    function getNormalizedWeights() external view returns (uint256[] memory);

    function totalSupply() external view returns (uint256);

    function getSwapFeePercentage() external view returns (uint256);
}

   
