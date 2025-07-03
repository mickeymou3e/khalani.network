// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGasPriceOracle} from "../interfaces/IGasPriceOracle.sol";

contract GasPriceOracle is IGasPriceOracle {
    mapping(uint32 => mapping(uint32 => uint256)) public gasPrices;

    constructor() {
        gasPrices[1098411886][43113] = 20 gwei; // Khalani ➡ Fuji
        gasPrices[1098411886][11155111] = 30 gwei; // Khalani ➡ Sepolia
        gasPrices[43113][1098411886] = 25 gwei; // Fuji ➡ Khalani
        gasPrices[43113][11155111] = 22 gwei; // Fuji ➡ Sepolia
        gasPrices[11155111][1098411886] = 28 gwei; // Sepolia ➡ Khalani
        gasPrices[11155111][43113] = 18 gwei; // Sepolia ➡ Fuji
    }

    function setGasPrice(uint32 sourceChainId, uint32 destinationChainId, uint256 gasPrice) external {
        gasPrices[sourceChainId][destinationChainId] = gasPrice;
    }

    function getGasPrice(uint32 sourceChainId, uint32 destinationChainId) external view override returns (uint256) {
        return gasPrices[sourceChainId][destinationChainId];
    }
}