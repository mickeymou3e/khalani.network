// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface ILinearPool {
    function getVirtualSupply() external view returns (uint256);
    function getSwapFeePercentage() external view returns (uint256);
    function getScalingFactors() external view returns (uint256[] memory);
    function getTargets() external view returns (uint256 lowerTarget, uint256 upperTarget);
    function totalSupply() external view returns (uint256);
}
