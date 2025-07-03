// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {
    XChainEvent,
    XChainAppEvent,
    DEPOSIT_EVENT,
    AssetReserveDeposit,
    WITHDRAWAL_EVENT,
    MTokenWithdrawal
} from "../types/Events.sol";
import {MTokenManager} from "../hub/MTokenManager.sol";
import {AssetReserves} from "../spoke/AssetReserves.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AbstractAIPEventHandler} from "../common/AbstractAIPEventHandler.sol";

contract AIPHubChainEventHandler is AbstractAIPEventHandler {
    constructor(address _owner) AbstractAIPEventHandler(_owner) {}
}
