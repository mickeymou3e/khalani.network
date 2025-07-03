// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {XChainEvent} from "../../types/Events.sol";

interface IEventProducer {
    function produceEvent(bytes calldata eventData, uint32 destChain) external payable;
}
