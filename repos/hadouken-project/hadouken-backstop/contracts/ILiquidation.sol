// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILiquidation {
    function liquidate (
        address debtToken,
        address collateralToken,
         address user,
        uint repayAmount) external returns (uint256);
}

     