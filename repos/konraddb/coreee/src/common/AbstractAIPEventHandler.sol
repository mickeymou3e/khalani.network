// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {
    XChainEvent, DEPOSIT_EVENT, AssetReserveDeposit, WITHDRAWAL_EVENT, MTokenWithdrawal
} from "../types/Events.sol";
import {MTokenManager} from "../hub/MTokenManager.sol";
import {AssetReserves} from "../spoke/AssetReserves.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// An AIP Event Handler is a global singleton that exists on each chain: both arcadia hub and each spoke.
// An AIP Event Handler is responsible for:
// 1. Registering a whitelisted set of Event Verifiers
// 2. Handling Events that have been validated by an event verifier
abstract contract AbstractAIPEventHandler is Ownable {
    error AIPEventHandler__NotEventVerifier();
    error AIPEventHandler__EventAlreadyHandled();
    error AIPEventHandler__InvalidEvent();

    event EventReceived(bytes32 indexed eventHash);

    mapping(address => bool) public s_registeredEventVerifiers;
    mapping(bytes32 => bool) public s_handledEvents;
    uint256 public s_eventCounter;

    modifier onlyEventVerifier() {
        if (!s_registeredEventVerifiers[msg.sender]) {
            revert AIPEventHandler__NotEventVerifier();
        }
        _;
    }

    constructor(address _owner) Ownable() {
        _transferOwnership(_owner);
    }

    function registerEventVerifier(address eventVerifier) external virtual onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = true;
    }

    function unregisterEventVerifier(address eventVerifier) external virtual onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = false;
    }

    function handleEvent(XChainEvent calldata ev) external virtual onlyEventVerifier {
        bytes32 eventHash = keccak256(abi.encode(s_eventCounter, ev));
        if (s_handledEvents[eventHash]) {
            revert AIPEventHandler__EventAlreadyHandled();
        }

        emit EventReceived(eventHash);
        if (ev.eventHash == WITHDRAWAL_EVENT) {
            handleWithdrawalEvent(ev);
        } else if (ev.eventHash == DEPOSIT_EVENT) {
            handleDepositEvent(ev);
        } else {
            revert AIPEventHandler__InvalidEvent();
        }
    }

    function handleWithdrawalEvent(XChainEvent calldata ev) internal virtual;
    function handleDepositEvent(XChainEvent calldata ev) internal virtual;
}
