// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC4626Test} from "erc4626-tests/ERC4626.test.sol";

import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
import "./Mock/MockStrategy.sol";
import "./Mock/MockYieldSource.sol";

contract ERC4626StdTest is ERC4626Test {
    ERC20 private _underlying = new ERC20Mock();
    MockYieldSource private _yieldSource;
    function setUp() public override {
        _underlying_ = address(_underlying);
        _yieldSource = new MockYieldSource(address(_underlying));
        _vault_ = address(new MockStrategy(_underlying, address(_yieldSource)));
        _delta_ = 0;
        _vaultMayBeEmpty = true;
        _unlimitedAmount = true;
    }

}
