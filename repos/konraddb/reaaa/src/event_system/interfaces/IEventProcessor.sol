// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {XChainEvent} from "../../types/Events.sol";

interface IEventProcessor {
    function processEvent(XChainEvent calldata _event, uint32 originChain) external;
}
