// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface IBProtocol {
    function canLiquidate(
        address debtAsset,
        address collateralAsset,
        address user,
        uint256 debtToCover
    )
    external
    returns(bool);

    function cBorrow() external view returns (address);
}