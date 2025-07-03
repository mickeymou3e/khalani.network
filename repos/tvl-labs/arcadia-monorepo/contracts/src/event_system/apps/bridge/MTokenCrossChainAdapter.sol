// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IEventProcessor} from "../../interfaces/IEventProcessor.sol";
import {AssetReserveDeposit} from "../../../types/Events.sol";
import {IEventProducer} from "../../interfaces/IEventProducer.sol";
import {IEventPublisher} from "../../interfaces/IEventPublisher.sol";
import {MTokenRegistry} from "../../../modules/MTokenRegistry.sol";
import {XChainEvent, MTokenWithdrawal} from "../../../types/Events.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IMTokenManager {
    function mintMToken(address to, address mToken, uint256 amount) external;
}

contract MTokenCrossChainAdapter is IEventProcessor, IEventProducer, Ownable {
    // ***************** //
    // *** ERRORS *** //
    // ***************** //
    error MTokenMinter__OnlyIMTokenManagerCanCall();
    error MTokenCrossChainAdapter__EventAlreadyProcessed(bytes32 eventHash);
    error MTokenCrossChainAdapter__OnlyEventHandlerCanCall();

    // ***************** //
    // *** EVENTS *** //
    // ***************** //

    event EventProcessed(bytes32 indexed eventHash);
    // ***************** //
    // *** MODIFIERS *** //
    // ***************** //

    modifier onlyEventHandler() {
        if (msg.sender != i_eventHandler) {
            revert MTokenCrossChainAdapter__OnlyEventHandlerCanCall();
        }
        _;
    }

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    address private immutable i_IMTokenManager;
    address private immutable i_eventPublisher;
    address private immutable i_eventHandler;
    address private immutable i_mTokenRegistry;

    bytes32 private immutable i_withdrawalEventTypeHash;
    bytes32 private immutable i_withdrawalEventType;

    mapping(bytes32 => bool) public processedEvents;
    mapping(bytes32 => bool) public producedEvents;

    uint256 public nonce;
    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    constructor(address _IMTokenManager, address _eventPublisher, address _mTokenRegistry, address _eventHandler)
        Ownable()
    {
        i_IMTokenManager = _IMTokenManager;
        i_eventPublisher = _eventPublisher;
        i_mTokenRegistry = _mTokenRegistry;
        i_eventHandler = _eventHandler;

        i_withdrawalEventTypeHash = keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");
        i_withdrawalEventType = keccak256(abi.encode(address(this), i_withdrawalEventTypeHash));
    }

    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //
    function processEvent(XChainEvent calldata _event, uint32 originChain) external override onlyEventHandler {
        bytes32 eventHash = keccak256(abi.encode(_event));
        if (processedEvents[eventHash]) {
            revert MTokenCrossChainAdapter__EventAlreadyProcessed(eventHash);
        }
        processedEvents[eventHash] = true;
        emit EventProcessed(eventHash);

        AssetReserveDeposit memory depositEvent = abi.decode(_event.eventData, (AssetReserveDeposit));
        address mToken = MTokenRegistry(i_mTokenRegistry).getMTokenForSpokeToken(originChain, depositEvent.token);
        IMTokenManager(i_IMTokenManager).mintMToken(depositEvent.depositor, mToken, depositEvent.amount);
    }

    function withdraw(address spokeToken, uint32 chainId, address _owner, uint256 amount) external payable {
        if (msg.sender != i_IMTokenManager) {
            revert MTokenMinter__OnlyIMTokenManagerCanCall();
        }

        nonce++;
        MTokenWithdrawal memory withdrawalEvent = MTokenWithdrawal(spokeToken, amount, _owner);
        bytes memory eventData = abi.encode(withdrawalEvent, nonce);

        bytes32 eventHash =
            IEventPublisher(i_eventPublisher).publishEvent{value: msg.value}(eventData, i_withdrawalEventType, chainId);
        producedEvents[eventHash] = true;
    }

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    function getWithdrawEventType() public view returns (bytes32) {
        return i_withdrawalEventType;
    }

    function didProduceEvent(bytes32 eventHash) external view returns (bool) {
        return producedEvents[eventHash];
    }
}
