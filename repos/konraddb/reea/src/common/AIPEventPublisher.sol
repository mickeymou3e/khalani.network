// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEventProver} from "../interfaces/IEventProver.sol";
import {XChainEvent} from "../types/Events.sol";

struct EventProverInfo {
    bool enabled;
    uint32 chainId;
}

contract AIPEventPublisher is Ownable {
    uint256 public s_eventNonce;

    error AIPEventPublisher__EventProverNotRegistered();
    error AIPEventPublisher__EventProverAlreadyRegistered();

    event EventProverRegistered(uint32 indexed chainId, address indexed eventProver);
    event EventProverUnregistered(address indexed eventProver);
    event EventPublished(bytes32 indexed eventHash, uint32 indexed destinationChainId);

    mapping(address prover => EventProverInfo proverInfo) public eventProvers;
    mapping(uint32 chainId => address prover) private s_chainToEventProver;
    mapping(bytes32 eventHash => bool published) public s_publishedEvents;
    address public s_defaultEventProver;

    constructor(address defaultEventProver) Ownable() {
        s_defaultEventProver = defaultEventProver;
    }

    function registerEventProver(uint32 chainId, address eventProver) external onlyOwner {
        if (eventProvers[eventProver].enabled == true) {
            revert AIPEventPublisher__EventProverAlreadyRegistered();
        }

        eventProvers[eventProver] = EventProverInfo(true, chainId);
        s_chainToEventProver[chainId] = eventProver;
        emit EventProverRegistered(chainId, eventProver);
    }

    function unregisterEventProver(address eventProver) external onlyOwner {
        require(eventProvers[eventProver].enabled, "EventProver not registered for this chain");
        delete eventProvers[eventProver];
        delete s_chainToEventProver[eventProvers[eventProver].chainId];
        emit EventProverUnregistered(eventProver);
    }

    function publishEvent(bytes calldata ev, bytes32 eventType, address _eventProver) external payable {
        _publishEvent(ev, eventType, _eventProver);
    }

    function publishEvent(bytes calldata eventData, bytes32 eventType) external payable {
        _publishEvent(eventData, eventType, s_defaultEventProver);
    }

    function publishEvent(bytes calldata eventData, bytes32 eventType, uint32 chainId) external payable {
        _publishEvent(eventData, eventType, chainId);
    }

    function _publishEvent(bytes calldata eventData, bytes32 eventType, address eventProver) internal {
        if (!eventProvers[eventProver].enabled) {
            revert AIPEventPublisher__EventProverNotRegistered();
        }
        uint32 destChainId = eventProvers[eventProver].chainId;
        XChainEvent memory ev = XChainEvent(address(this), block.chainid, eventType, eventData);
        bytes32 eventHash = keccak256(abi.encode(s_eventNonce, ev));

        emit EventPublished(eventHash, destChainId);
        s_eventNonce++;
        s_publishedEvents[eventHash] = true;
        IEventProver(eventProver).registerEvent{value: msg.value}(ev);
    }

    function _publishEvent(bytes calldata eventData, bytes32 eventType, uint32 _chainId) internal {
        if (s_chainToEventProver[_chainId] == address(0)) {
            revert AIPEventPublisher__EventProverNotRegistered();
        }

        _publishEvent(eventData, eventType, s_chainToEventProver[_chainId]);
    }
}
