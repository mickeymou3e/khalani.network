// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {IEventProver} from "../../src/event_system/interfaces/IEventProver.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {XChainEvent} from "../../src/types/Events.sol";

contract MockEventProver is IEventProver {
    event EventRegistered(XChainEvent indexed xchainEvent);

    function registerEvent(XChainEvent calldata _event) external payable override {
        emit EventRegistered(_event);
    }
}

contract EventSystemInvariantsTest is Test {
    SpokePublisher spokePublisher;
    HubHandler hubHandler;
    MockEventProver mockEventProver;

    address owner = address(0x123);
    address producer1 = address(0x456);
    address producer2 = address(0x789);
    address processor1 = address(0x111);
    address processor2 = address(0x222);
    bytes32 eventType1 = keccak256("EventType1");
    bytes32 eventType2 = keccak256("EventType2");

    function setUp() public {
        vm.startPrank(owner);
        vm.deal(producer1, 1 ether);

        // Deploy the contracts
        hubHandler = new HubHandler();
        spokePublisher = new SpokePublisher(1);

        // Register Mock EventProver
        mockEventProver = new MockEventProver();
        spokePublisher.registerEventProver(1, address(mockEventProver));

        // Add producers
        spokePublisher.addProducer(producer1);
        spokePublisher.addProducer(producer2);

        vm.stopPrank();
    }

    // Test invariant: No two producers can produce the same event
    function testNoTwoProducersCanProduceSameEvent() public {
        vm.startPrank(owner);
        spokePublisher.registerEventOnProducer(producer1, eventType1);

        vm.expectRevert(abi.encodeWithSignature("SpokePublisher__EventTypeAlreadyRegistered(bytes32)", eventType1));
        spokePublisher.registerEventOnProducer(producer2, eventType1);

        vm.stopPrank();
    }

    // Test invariant: No two processors can subscribe to the same event
    function testNoTwoProcessorsCanSubscribeToSameEvent() public {
        vm.startPrank(owner);

        hubHandler.registerEventProcessor(processor1);
        hubHandler.registerEventType(processor1, eventType2);

        vm.expectRevert(abi.encodeWithSignature("HubHandler__EventTypeAlreadyRegistered()"));
        hubHandler.registerEventType(processor2, eventType2);

        vm.stopPrank();
    }

    // Test invariant: Producer can unregister their event type
    // and another producer can register the same event type
    function testProducerUnregisterEventTypeAllowsReRegistration() public {
        bytes32 eventStructTypeHash = keccak256("ExampleEvent");

        bytes32 eventType1 = keccak256(abi.encode(producer1, eventStructTypeHash));

        // Register event type with producer1
        vm.prank(owner);
        spokePublisher.registerEventOnProducer(producer1, eventType1);
        assertEq(spokePublisher.s_producerForEventType(eventType1), producer1);

        // Revoke producer1's event type
        vm.prank(owner);
        spokePublisher.revokeProduceAccessPartial(producer1, eventStructTypeHash);
        assertEq(spokePublisher.s_producerForEventType(eventType1), address(0));

        // Register the same event type with producer2
        bytes32 eventType2 = keccak256(abi.encode(producer2, eventStructTypeHash));
        vm.prank(owner);
        spokePublisher.registerEventOnProducer(producer2, eventType2);
        assertEq(spokePublisher.s_producerForEventType(eventType2), producer2);
    }

    // Test invariant: Spoke chain producers and handler can ONLY send events to arcadia
    function testProducersAndHandlerOnlySendToArcadia() public {
        address nonArcadiaAddress = address(0x999);
        uint32 nonArcadiaChainId = 3;

        vm.startPrank(owner);

        // Register a valid event producer
        spokePublisher.addProducer(producer1);

        // Register valid event type
        spokePublisher.registerEventOnProducer(producer1, eventType1);

        vm.stopPrank();

        // Simulate producer attempting to send to a non-arcadia address
        vm.startPrank(producer1);

        bytes memory eventData = abi.encode("Test Event");
        vm.expectRevert(abi.encodeWithSignature("SpokePublisher__InvalidDestination()"));
        spokePublisher.publishEvent{value: 0.1 ether}(eventData, eventType1, nonArcadiaChainId);

        vm.stopPrank();
    }
}
