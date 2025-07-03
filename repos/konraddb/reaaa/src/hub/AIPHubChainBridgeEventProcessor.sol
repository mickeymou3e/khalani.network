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
import {IApplicationEventProcessor} from "../interfaces/IApplicationEventProcessor.sol";

contract AIPHubChainBridgeEventProcessor is IApplicationEventProcessor {
    event DepositEventProcessed(address indexed depositor, address indexed token, uint256 amount);

    MTokenManager private immutable i_mTokenManager;

    constructor(address _mTokenManager) {
        i_mTokenManager = MTokenManager(_mTokenManager);
    }

    function processEvent(XChainAppEvent calldata _event) external {
        if (_event.eventHash == DEPOSIT_EVENT) {
            AssetReserveDeposit memory depositEvent = abi.decode(_event.eventData, (AssetReserveDeposit));
            emit DepositEventProcessed(depositEvent.depositor, depositEvent.token, depositEvent.amount);
            i_mTokenManager.mintMToken(depositEvent.depositor, depositEvent.token, depositEvent.amount);
        }
    }
}
