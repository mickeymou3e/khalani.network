// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventVerifier} from "./interfaces/IEventVerifier.sol";
import {IEventProcessor} from "./interfaces/IEventProcessor.sol";
import {XChainEvent} from "../types/Events.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEventHandler} from "./interfaces/IEventHandler.sol";

contract SpokeHandler is Ownable, IEventHandler {
    error SpokeHandler__NotEventVerifier();
    error SpokeHandler__NotEventProcessor();
    error SpokeHandler__EventTypeAlreadyRegistered();
    error SpokeHandler__EventTypeNotRegistered();

    event SpokeHandler__EventVerifierRegistered(address indexed eventVerifier);
    event SpokeHandler__EventVerifierUnregistered(address indexed eventVerifier);
    event SpokeHandler__EventHandled(bytes32 indexed eventHash, address indexed eventVerifier);
    event SpokeHandler__EventProcessorDeleted(bytes32 indexed eventType, address indexed processor);

    mapping(address => bool) public s_registeredEventVerifiers;
    mapping(address => bool) public s_registeredEventProcessors;
    mapping(bytes32 => address) private s_processorForEventType;

    constructor() Ownable() {}

    function registerEventVerifier(address eventVerifier) external onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = true;
        emit SpokeHandler__EventVerifierRegistered(eventVerifier);
    }

    function unregisterEventVerifier(address eventVerifier) external onlyOwner {
        s_registeredEventVerifiers[eventVerifier] = false;
        emit SpokeHandler__EventVerifierUnregistered(eventVerifier);
    }

    function registerEventProcessor(address eventProcessor) external onlyOwner {
        s_registeredEventProcessors[eventProcessor] = true;
    }

    function unregisterEventProcessor(address eventProcessor) external onlyOwner {
        s_registeredEventProcessors[eventProcessor] = false;
    }

    function registerEventTypeByProcessor(bytes32 eventType) external {
        if (!s_registeredEventProcessors[msg.sender]) {
            revert SpokeHandler__NotEventProcessor();
        }
        if (s_processorForEventType[eventType] != address(0)) {
            revert SpokeHandler__EventTypeAlreadyRegistered();
        }
        s_processorForEventType[eventType] = msg.sender;
    }

    function registerEventType(address processor, bytes32 eventType) external onlyOwner {
        if (s_processorForEventType[eventType] != address(0)) {
            revert SpokeHandler__EventTypeAlreadyRegistered();
        }
        s_processorForEventType[eventType] = processor;
    }

    function deleteEventProcessorForEventType(bytes32 eventType) external onlyOwner {
        address processor = s_processorForEventType[eventType];
        if (processor == address(0)) {
            revert SpokeHandler__EventTypeNotRegistered();
        }
        delete s_processorForEventType[eventType];
        emit SpokeHandler__EventProcessorDeleted(eventType, processor);
    }

    function viewEventProcessorForEventType(bytes32 eventType) external view returns (address) {
        address processor = s_processorForEventType[eventType];
        if (processor == address(0)) {
            revert SpokeHandler__EventTypeNotRegistered();
        }
        return processor;
    }

    function handleEvent(XChainEvent calldata ev, uint32 originChain) external override {
        uint32 chainId = uint32(block.chainid);
        if (!s_registeredEventVerifiers[msg.sender]) {
            revert SpokeHandler__NotEventVerifier();
        }
        bytes32 eventType = ev.eventHash;
        address eventProcessor = s_processorForEventType[eventType];
        if (eventProcessor == address(0)) {
            revert SpokeHandler__NotEventProcessor();
        }
        emit SpokeHandler__EventHandled(ev.eventHash, msg.sender);
        IEventProcessor(eventProcessor).processEvent(ev, chainId);
    }
}