// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IEventPublisher {
    function publishEvent(bytes calldata eventData, bytes32 eventType, uint32 chainId) external payable;
}
