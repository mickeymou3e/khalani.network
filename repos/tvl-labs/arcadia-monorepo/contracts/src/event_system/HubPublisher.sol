// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {XChainEvent} from "../types/Events.sol";
import {IEventProver} from "./interfaces/IEventProver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEventPublisher} from "./interfaces/IEventPublisher.sol";

struct EventProverMetadata {
    bool enabled;
    uint32 chainId;
}

// Maintains three primary sets of states:
// 1. Event Provers whitelist and metadata
// 2. Event producers whitelist and metadata
// 3. Event Handling related informatin
contract HubPublisher is Ownable, IEventPublisher {
    error HubPublisher__EventProverAlreadyRegistered();
    error HubPublisher__EventProverNotRegistered();
    error HubPublisher__EventProducerNotAuthorized(address eventProducer);
    error HubPublisher__EventTypeAlreadyRegistered(bytes32 eventType);

    event EventProverRegistered(address indexed eventProver);
    event EventProverUnregistered(address indexed eventProver);
    event EventPublished(bytes32 indexed eventHash, uint32 destinationChainId);
    event NewProducerAuthorized(address indexed eventProducer, bytes32 indexed eventType);
    event NewEventTypeRegistered(bytes32 indexed eventType);

    uint256 public s_eventNonce;
    // Producer registration information
    mapping(address eventProducer => bool authorized) public s_eventProducers;
    mapping(bytes32 eventType => address adminEventProducer) public s_producerForEventType;
    mapping(address eventProducer => bytes32[] eventTypes) private s_eventTypeRegistrations;

    // Event prover information
    mapping(address prover => EventProverMetadata proverInfo) public s_eventProvers;
    mapping(uint32 chainId => address prover) private s_chainToEventProver;
    mapping(bytes32 eventHash => bool published) public s_publishedEvents;

    modifier onlyProducer() {
        if (!s_eventProducers[msg.sender]) {
            revert HubPublisher__EventProducerNotAuthorized(msg.sender);
        }
        _;
    }

    constructor() Ownable() {}

    function publishEvent(bytes calldata eventData, bytes32 eventType, uint32 chainId)
        external
        payable
        returns (bytes32)
    {
        if (!s_eventProducers[msg.sender]) {
            revert HubPublisher__EventProducerNotAuthorized(msg.sender);
        }
        if (s_producerForEventType[eventType] != msg.sender) {
            revert HubPublisher__EventProducerNotAuthorized(msg.sender);
        }

        uint256 nonce = s_eventNonce;
        s_eventNonce += 1;
        XChainEvent memory ev = XChainEvent(address(this), block.chainid, eventType, eventData, nonce);

        if (s_chainToEventProver[chainId] == address(0)) {
            revert HubPublisher__EventProverNotRegistered();
        }
        bytes32 eventHash = keccak256(abi.encode(ev));

        s_publishedEvents[eventHash] = true;
        emit EventPublished(eventHash, chainId);
        IEventProver(s_chainToEventProver[chainId]).registerEvent{value: msg.value}(ev);
        return eventHash;
    }

    function registerEventProver(uint32 chainId, address eventProver) external onlyOwner {
        if (s_eventProvers[eventProver].enabled == true) {
            revert HubPublisher__EventProverAlreadyRegistered();
        }

        s_eventProvers[eventProver] = EventProverMetadata(true, chainId);
        s_chainToEventProver[chainId] = eventProver;
        emit EventProverRegistered(eventProver);
    }

    function unregisterEventProver(address eventProver) external onlyOwner {
        require(s_eventProvers[eventProver].enabled, "EventProver not registered for this chain");
        delete s_eventProvers[eventProver];
        delete s_chainToEventProver[s_eventProvers[eventProver].chainId];
        emit EventProverUnregistered(eventProver);
    }

    function registerEventOnProducer(address eventProducer, bytes32 eventType) public onlyOwner {
        if (s_producerForEventType[eventType] != address(0)) {
            revert HubPublisher__EventTypeAlreadyRegistered(eventType);
        }

        emit NewProducerAuthorized(eventProducer, eventType);
        s_producerForEventType[eventType] = eventProducer;
        s_eventTypeRegistrations[eventProducer].push(eventType);
    }

    function registerEventType(bytes32 eventStructTypeHash) public {
        if (!s_eventProducers[msg.sender]) {
            revert HubPublisher__EventProducerNotAuthorized(msg.sender);
        }
        bytes32 eventType = keccak256(abi.encode(msg.sender, eventStructTypeHash));
        if (s_producerForEventType[eventType] != address(0)) {
            revert HubPublisher__EventTypeAlreadyRegistered(eventType);
        }

        emit NewEventTypeRegistered(eventType);

        s_producerForEventType[eventType] = msg.sender;
        s_eventTypeRegistrations[msg.sender].push(eventType);
    }

    function addProducer(address producer) external onlyOwner {
        s_eventProducers[producer] = true;
    }

    function addEventForProducer(address producer, bytes32 eventStructTypeHash) private {
        bytes32 eventType = keccak256(abi.encode(producer, eventStructTypeHash));
        s_producerForEventType[eventType] = producer;

        s_eventTypeRegistrations[producer].push(eventType);
    }

    function revokeProducerAccessFull(address producer) external onlyOwner {
        s_eventProducers[producer] = false;
        bytes32[] memory eventTypes = s_eventTypeRegistrations[producer];
        for (uint256 i = 0; i < eventTypes.length; i++) {
            delete s_producerForEventType[eventTypes[i]];
        }

        delete s_eventTypeRegistrations[producer];
    }

    function revokeProduceAccessPartial(address producer, bytes32 eventStructTypeHash) external onlyOwner {
        bytes32 eventType = keccak256(abi.encode(producer, eventStructTypeHash));
        delete s_producerForEventType[eventType];
    }

    receive() external payable {}
}
