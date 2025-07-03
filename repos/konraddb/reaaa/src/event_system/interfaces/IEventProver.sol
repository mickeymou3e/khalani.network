// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {XChainEvent} from "../../types/Events.sol";

interface IEventProver {
    function registerEvent(XChainEvent calldata _event) external payable;
}
