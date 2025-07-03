// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGasPriceOracle {
    function setGasPrice(uint32 chainId, uint32 destinationChainId, uint256 gasPrice) external;
    function getGasPrice(uint32 chainId, uint32 destinationChainId) external view returns (uint256);
}