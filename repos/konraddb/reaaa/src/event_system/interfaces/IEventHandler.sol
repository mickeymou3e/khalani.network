// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {XChainEvent} from "../../types/Events.sol";

interface IEventHandler {
    function handleEvent(XChainEvent calldata ev, uint32 originChain) external;
}
