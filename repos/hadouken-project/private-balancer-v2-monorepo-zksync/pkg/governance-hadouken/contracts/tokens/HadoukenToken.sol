pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "../utils/ERC20.sol";

contract HadoukenToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Hadouken", "HDK") {
        _mint(msg.sender, initialSupply);
    }
}
