// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 _amount) public {
        _mint(to, _amount);
    }

    function burn(address from, uint256 _amount) public {
        _burn(from, _amount);
    }
}
