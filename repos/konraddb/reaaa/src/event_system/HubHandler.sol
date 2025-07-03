// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventVerifier} from "./interfaces/IEventVerifier.sol";
import {IEventProcessor} from "./interfaces/IEventProcessor.sol";
import {XChainEvent} from "../types/Events.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEventHandler} from "./interfaces/IEventHandler.sol";

contract HubHandler is Ownable, IEventHandler {
    error HubHandler__NotEventVerifier();
    error HubHandler__NotEventProcessor();
    error HubHandler__EventTypeAlreadyRegistered();
    error HubHandler__EventTypeNotRegistered();

    event HubHandler__EventVerifierRegistered(address indexed eventVerifier);
    event HubHandler__EventVerifierUnregistered(address indexed eventVerifier);
    event HubHandler__EventHandled(bytes32 indexed eventHash, address indexed eventVerifier);
    event HubHandler__EventTypeUnregistered(bytes32 indexed eventHash);

    mapping(address => bool) public s_registeredEventVerifiers;
    mapping(address => bool) public s_registeredEventProcessors;

    mapping(bytes32 eventType => address eventProcessor) private s_processorForEventType;

    constructor() Ownable() {}

    function registerEventVerifier(address eventVerifier) external onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = true;
        emit HubHandler__EventVerifierRegistered(eventVerifier);
    }

    function unregisterEventVerifier(address eventVerifier) external onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = false;
        emit HubHandler__EventVerifierUnregistered(eventVerifier);
    }

    function registerEventProcessor(address eventProcessor) external onlyOwner {
        s_registeredEventProcessors[eventProcessor] = true;
    }

    function unregisterEventProcessor(address eventProcessor) external onlyOwner {
        s_registeredEventProcessors[eventProcessor] = false;
    }

    function registerEventTypeByProcessor(bytes32 eventType) external {
        if (!s_registeredEventProcessors[msg.sender]) {
            revert HubHandler__NotEventProcessor();
        }
        if (s_processorForEventType[eventType] != address(0)) {
            revert HubHandler__EventTypeAlreadyRegistered();
        }
        s_processorForEventType[eventType] = msg.sender;
    }

    function unregisterEventType(bytes32 eventType) external onlyOwner {
        address processor = s_processorForEventType[eventType];
        if (processor == address(0)) {
            revert HubHandler__EventTypeNotRegistered();
        }
        delete s_processorForEventType[eventType];
        emit HubHandler__EventTypeUnregistered(eventType);
    }

    function registerEventType(address processor, bytes32 eventType) external {
        _registerEventType(processor, eventType);
    }

    function _registerEventType(address processor, bytes32 eventType) internal {
        if (s_processorForEventType[eventType] != address(0)) {
            revert HubHandler__EventTypeAlreadyRegistered();
        }
        s_processorForEventType[eventType] = processor;
    }

    function registerEventTypeOnProcessor(address processor, bytes32 eventType) external {
        _registerEventType(processor, eventType);
    }

    function handleEvent(XChainEvent calldata ev, uint32 originChain) external override {
        if (!s_registeredEventVerifiers[msg.sender]) {
            revert HubHandler__NotEventVerifier();
        }
        bytes32 eventType = ev.eventHash;
        address eventProcessor = s_processorForEventType[eventType];
        if (eventProcessor == address(0)) {
            revert HubHandler__NotEventProcessor();
        }
        emit HubHandler__EventHandled(ev.eventHash, msg.sender);
        IEventProcessor(eventProcessor).processEvent(ev, originChain);
    }
}
