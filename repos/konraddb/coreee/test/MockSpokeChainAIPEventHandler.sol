// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventProver} from "../src/interfaces/IEventProver.sol";
import {EventProver} from "../src/common/EventProver.sol";
import {AbstractAIPEventHandler} from "../src/common/AbstractAIPEventHandler.sol";
import {XChainEvent} from "../src/types/Events.sol";

contract MockSpokeChainAIPEventHandler is AbstractAIPEventHandler {
    constructor(address _mailbox, address _remoteVerifier, address _owner) AbstractAIPEventHandler(_owner) {}

    function handleWithdrawalEvent(XChainEvent calldata ev) internal override {
        // TODO
    }

    function handleDepositEvent(XChainEvent calldata ev) internal override {
        // TODO
    }
}
