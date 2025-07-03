// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventProver} from "../src/interfaces/IEventProver.sol";
import {EventProver} from "../src/common/EventProver.sol";
import {AbstractAIPEventHandler} from "../src/common/AbstractAIPEventHandler.sol";
import {XChainEvent} from "../src/types/Events.sol";
import {IEventHandler} from "../src/event_system/interfaces/IEventHandler.sol";

contract MockArcadiaAIPEventHandler is AbstractAIPEventHandler {
    constructor(address _mailbox, address _owner) AbstractAIPEventHandler(_owner) {}

    function handleWithdrawalEvent(XChainEvent calldata ev) internal {
        // TODO
    }

    function handleDepositEvent(XChainEvent calldata ev) internal {
        // TODO
    }
}
