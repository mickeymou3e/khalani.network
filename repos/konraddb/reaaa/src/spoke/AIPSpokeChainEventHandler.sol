// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {
    XChainEvent, DEPOSIT_EVENT, AssetReserveDeposit, WITHDRAWAL_EVENT, MTokenWithdrawal
} from "../types/Events.sol";
import {MTokenManager} from "../hub/MTokenManager.sol";
import {AssetReserves} from "../spoke/AssetReserves.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AbstractAIPEventHandler} from "../common/AbstractAIPEventHandler.sol";

contract AIPSpokeChainEventHandler is AbstractAIPEventHandler {
    MTokenManager public immutable mTokenManager;
    AssetReserves public assetReserves;

    // Registry of EventVerifiers
    mapping(address => bool) public registeredEventVerifiers;

    event EventVerifierRegistered(address indexed eventVerifier);
    event EventVerifierUnregistered(address indexed eventVerifier);
    event EventHandled(bytes32 indexed eventHash, address indexed eventVerifier);

    constructor(address _mTokenManager, address _assetReserves, address _owner) AbstractAIPEventHandler(_owner) {
        mTokenManager = MTokenManager(_mTokenManager);
        assetReserves = AssetReserves(_assetReserves);
    }

    function setAssetReserves(address _assetReserves) external onlyOwner {
        require(_assetReserves != address(0), "Invalid AssetReserves address");
        assetReserves = AssetReserves(_assetReserves);
    }

    function registerEventVerifier(address eventVerifier) external override onlyOwner {
        require(!registeredEventVerifiers[eventVerifier], "EventVerifier already registered");
        registeredEventVerifiers[eventVerifier] = true;
        emit EventVerifierRegistered(eventVerifier);
    }

    function unregisterEventVerifier(address eventVerifier) external override onlyOwner {
        require(registeredEventVerifiers[eventVerifier], "EventVerifier not registered");
        registeredEventVerifiers[eventVerifier] = false;
        emit EventVerifierUnregistered(eventVerifier);
    }

    function handleArcadiaEvent(XChainEvent calldata ev) internal {
        if (ev.eventHash == DEPOSIT_EVENT) {
            // Mint MTokens on Arcadia
            AssetReserveDeposit memory depositEvent = abi.decode(ev.eventData, (AssetReserveDeposit));
            mTokenManager.mintMToken(depositEvent.depositor, depositEvent.token, depositEvent.amount);
        }
        // Note: Withdrawal events are not handled here as they are managed by MTokenManager -> AIPEventPublisher interactions
    }

    function handleSpokeEvent(XChainEvent calldata ev) internal {
        if (ev.eventHash == WITHDRAWAL_EVENT) {
            // Lock tokens in AssetReserves on spoke chain
            MTokenWithdrawal memory withdrawalEvent = abi.decode(ev.eventData, (MTokenWithdrawal));
            assetReserves.withdraw(withdrawalEvent.token, withdrawalEvent.amount);
        }
    }

    function handleWithdrawalEvent(XChainEvent calldata ev) internal {
        if (ev.eventHash == WITHDRAWAL_EVENT) {
            // Lock tokens in AssetReserves on spoke chain
            MTokenWithdrawal memory withdrawalEvent = abi.decode(ev.eventData, (MTokenWithdrawal));
            assetReserves.withdraw(withdrawalEvent.token, withdrawalEvent.amount);
        }
    }
}

enum XChainEventType {
    Deposit,
    Withdrawal
}
