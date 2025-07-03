pragma solidity ^0.8.0;

import "./ERC20MintableBurnable.sol";

contract ERC20MintableBurnableDecimal is ERC20MintableBurnable {
    uint8 private _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20MintableBurnable(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}