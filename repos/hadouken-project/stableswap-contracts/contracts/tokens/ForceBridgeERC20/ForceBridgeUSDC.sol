// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./ForceBridgeERC20.sol";

contract ForceBridgeUSDT is ForceBridgeERC20 {
    string public constant name = "USDT Test Token";
    string public constant symbol = "USDT";
    uint8 public constant decimals = 6;
    uint constant _supply = 100000000;
    address private governance;

    modifier onlyGov() {
        require(msg.sender == governance, "caller is not the governance");
        _;
    }

    constructor() {
        governance = msg.sender;
        _mint(msg.sender, _supply);
    }

    function claimTestToken(address account) external {
        _mint(account, _supply);
    }

    function mint(uint256 amount) external onlyGov {
        _mint(msg.sender, amount);
    }
}