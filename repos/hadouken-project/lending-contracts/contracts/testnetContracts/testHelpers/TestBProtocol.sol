// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {IBProtocol} from '../../interfaces/IBProtocol.sol';
import {ILendingPool} from '../../interfaces/ILendingPool.sol';
import {IERC20} from '../../dependencies/openzeppelin/contracts/IERC20.sol';

contract TestBProtocol is IBProtocol {
    address _pool;

    constructor(address pool) public {
        _pool = pool;
    }

    function cBorrow() external override view returns(address) {
        return address(0);
    }
    
    function canLiquidate(
        address debtAsset,
        address collateralAsset,
        address user,
        uint debtToCove
    ) external override returns(bool) {
        uint256 tokenBalance = IERC20(debtAsset).balanceOf(address(this));
        bool hasFunds = debtToCove <= tokenBalance;
        return hasFunds && collateralAsset != address(0);
    }

    function liquidationCall(
        address collateralAsset,
        address debtAsset,
        address user,
        uint256 debtToCover,
        bool receiveAToken
    ) external {
        ILendingPool pool = ILendingPool(_pool);
        IERC20(debtAsset).approve(_pool, debtToCover);

        pool.liquidationCall(collateralAsset,
            debtAsset,
            user,
            debtToCover,
            receiveAToken
        );
    }
}