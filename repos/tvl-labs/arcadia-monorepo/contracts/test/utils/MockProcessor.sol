// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventProcessor} from "../../src/event_system/interfaces/IEventProcessor.sol";
import {XChainEvent} from "../../src/types/Events.sol";

contract MockProcessor is IEventProcessor {
    event EventReceived(address sender, string message);

    function processEvent(XChainEvent calldata ev, uint32 originChain) external override {
        (string memory message, address originalSender) = abi.decode(ev.eventData, (string, address));
        emit EventReceived(originalSender, string(abi.encodePacked(message, " received")));
    }
}