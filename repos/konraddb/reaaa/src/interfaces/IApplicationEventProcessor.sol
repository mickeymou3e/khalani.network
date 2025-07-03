// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {XChainAppEvent} from "../types/Events.sol";

interface IApplicationEventProcessor {
    function processEvent(XChainAppEvent calldata _event) external;
}
