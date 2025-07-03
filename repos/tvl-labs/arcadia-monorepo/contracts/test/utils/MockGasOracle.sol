// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract MockGasOracle {
    function getGasAmount(uint32 sourceChainId, uint32 destinationChainId) external view returns (uint256) {
        return 100000;
    }
}