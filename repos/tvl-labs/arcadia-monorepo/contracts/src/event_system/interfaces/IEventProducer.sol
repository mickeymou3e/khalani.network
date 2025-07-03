// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {XChainEvent} from "../../types/Events.sol";

interface IEventProducer {
    event EventProduced(bytes32 indexed eventType, XChainEvent indexed eventData);

    function didProduceEvent(bytes32 eventHash) external view returns (bool);
}
