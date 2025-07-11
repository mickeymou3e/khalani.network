pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {MockYieldSource} from "./MockYieldSource.sol";
import {BaseStrategy} from "../../src/ReserveVault/BaseStrategy.sol";

contract MockStrategy is BaseStrategy {
    address public yieldSource;
    bool public trigger;
    bool public managed;
    bool public kept;

    constructor(
        IERC20 _asset,
        address _yieldSource
    ) BaseStrategy(_asset, "Test Strategy", "TSTRAT") {
        require(yieldSource == address(0));
        yieldSource = _yieldSource;
        IERC20(asset()).approve(_yieldSource, type(uint256).max);
    }

    function _deployFunds(uint256 _amount) internal override {
        MockYieldSource(yieldSource).deposit(_amount);
    }

    function _freeFunds(uint256 _amount) internal override {
        MockYieldSource(yieldSource).withdraw(_amount);
    }

    function _harvestAndReport() internal override returns (uint256) {
        uint256 balance = IERC20(asset()).balanceOf(address(this));
        if (balance > 0 && !shutdown) {
            MockYieldSource(yieldSource).deposit(balance);
        }
        return
            MockYieldSource(yieldSource).balance() +
            IERC20(asset()).balanceOf(address(this));
    }
}



