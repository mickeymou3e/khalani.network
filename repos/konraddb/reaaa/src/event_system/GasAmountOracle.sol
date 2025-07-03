// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract GasAmountOracle is Ownable {
    mapping(uint32 => mapping(uint32 => uint256)) public gasAmount;

    constructor() {
        gasAmount[43113][1098411886] = 500000;
        gasAmount[17000][1098411886] = 500000;
    }

    function setGasAmount(
        uint32 sourceChainId,
        uint32 destinationChainId,
        uint256 newGasAmount
    ) external onlyOwner {
        gasAmount[sourceChainId][destinationChainId] = newGasAmount;
    }

    function getGasAmount(
        uint32 sourceChainId,
        uint32 destinationChainId
    ) external view returns (uint256) {
        return gasAmount[sourceChainId][destinationChainId];
    }
}