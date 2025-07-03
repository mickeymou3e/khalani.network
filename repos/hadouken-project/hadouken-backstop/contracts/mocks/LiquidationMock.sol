// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ILiquidation} from "../ILiquidation.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidationMock is ILiquidation {
    address _backstop;
    IERC20 _liquidationToken;
    uint256 _sendAmount;

    constructor(
        address liquidationToken
    ) {
        _liquidationToken = IERC20(liquidationToken);
    }

    function liquidate(
        address,
        address,
        address,
        uint
    ) external override returns (uint256) {
        _liquidationToken.transfer(_backstop, _sendAmount);
        return _sendAmount;
    }

    function setBackstop(address backstop) external {
        _backstop = backstop;
    }

    function setSendAmount(uint256 sendAmount) external {
        _sendAmount = sendAmount;
    }

   
}
