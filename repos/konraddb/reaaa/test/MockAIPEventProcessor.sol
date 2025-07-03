// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/common/EventVerifier.sol";

import {IApplicationEventProcessor} from "../src/interfaces/IApplicationEventProcessor.sol";

contract MockAIPEventProcessor is IApplicationEventProcessor {
    function processEvent(XChainAppEvent calldata _event) external {}
}
