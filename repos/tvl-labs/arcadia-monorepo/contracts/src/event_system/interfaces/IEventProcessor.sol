// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {XChainEvent} from "../../types/Events.sol";

interface IEventProcessor {
    event EventProcessed(bytes32 indexed eventHash, XChainEvent indexed eventData);

    function processEvent(XChainEvent calldata _event, uint32 originChain) external;
}
