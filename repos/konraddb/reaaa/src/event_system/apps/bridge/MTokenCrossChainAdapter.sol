// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventProcessor} from "../../interfaces/IEventProcessor.sol";
import {AssetReserveDeposit} from "../../../types/Events.sol";
import {IEventProducer} from "../../interfaces/IEventProducer.sol";
import {IEventPublisher} from "../../interfaces/IEventPublisher.sol";
import {MTokenRegistry} from "../../../modules/MTokenRegistry.sol";
import {SpokeTokenInfo} from "../../../types/MToken.sol";
import {XChainEvent, MTokenWithdrawal} from "../../../types/Events.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IMTokenManager {
    function mintMToken(address to, address mToken, uint256 amount) external;
}

// To process MToken deposits from spoke chain to hub
// And to process MToken withdrawals from hub to spoke
contract MTokenCrossChainAdapter is IEventProcessor, IEventProducer, Ownable {
    error MTokenMinter__OnlyIMTokenManagerCanCall();

    address private immutable i_IMTokenManager;
    address private immutable i_eventPublisher;
    address private immutable i_mTokenRegistry;

    bytes32 private immutable i_withdrawalEventType;
    bytes32 private immutable i_withdrawalEventTypeHash;

    uint256 public nonce;

    constructor(address _IMTokenManager, address _eventPublisher, address _mTokenRegistry) Ownable() {
        i_IMTokenManager = _IMTokenManager;
        i_eventPublisher = _eventPublisher;
        i_mTokenRegistry = _mTokenRegistry;

        i_withdrawalEventTypeHash = keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");
        i_withdrawalEventType = keccak256(abi.encode(owner(), i_withdrawalEventTypeHash));
    }

    function getWithdrawEventType() public view returns (bytes32) {
        return i_withdrawalEventType;
    }

    function processEvent(XChainEvent calldata _event, uint32 originChain) external override {
        AssetReserveDeposit memory depositEvent = abi.decode(_event.eventData, (AssetReserveDeposit));
        address mToken = MTokenRegistry(i_mTokenRegistry).getMTokenForSpokeToken(originChain, depositEvent.token);

        IMTokenManager(i_IMTokenManager).mintMToken(depositEvent.depositor, mToken, depositEvent.amount);
    }

    function withdraw(address spokeToken, uint32 chainId, address owner, uint256 amount) external payable {
        if (msg.sender != i_IMTokenManager) {
            revert MTokenMinter__OnlyIMTokenManagerCanCall();
        }

        MTokenWithdrawal memory withdrawalEvent = MTokenWithdrawal(spokeToken, amount, owner);
        bytes memory eventData = abi.encode(withdrawalEvent, nonce);

        IEventPublisher(i_eventPublisher).publishEvent{value: msg.value}(eventData, i_withdrawalEventType, chainId);
        nonce++;
    }

    function produceEvent(bytes memory eventData, uint32 destChain) external payable override {
        IEventPublisher(i_eventPublisher).publishEvent{value: msg.value}(eventData, i_withdrawalEventType, destChain);
    }
}
