
// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface IBAMM {
    function cBorrow() external view returns (address);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function totalSupply() external view returns (uint256);

    function getCollateralValue() external view returns(bool succ, uint value);

    function deposit(uint lusdAmount) external;

    function withdraw(uint numShares) external;

    function canLiquidate(
        address debtAsset,
        address collateralAsset,
        uint debtToCover
    ) external view returns(bool);

    function liquidateBorrow(
        address borrower,
        uint amount,
        address collateral
    ) external returns (uint);
}

