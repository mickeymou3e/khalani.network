// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Test} from "forge-std/Test.sol";
import {SpokePublisher} from "../../../src/event_system/SpokePublisher.sol";
import {MockInterchainGasPaymaster} from "../../MockInterchainGasPaymaster.sol";
import {MockGasOracle} from "../../utils/MockGasOracle.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {EventProver} from "../../../src/event_system/EventProver.sol";

contract SpokePublisherTests is Test {
    SpokePublisher internal spokePublisher;
    address internal owner = address(0x123);
    EventProver internal eventProver;
    address internal producer = address(0x789);
    address internal notProducer = address(0x333);

    uint32 internal hubChainId = 100;
    bytes32 internal exampleEventTypeHash = keccak256("ExampleTypeHash");
    bytes32 internal exampleEventType;  

    function setUp() public {
        vm.startPrank(owner);
        MockMailbox mockMailbox = new MockMailbox(1);
        MockMailbox spokeToHubDestinationMailbox = new MockMailbox(2);
        mockMailbox.addRemoteMailbox(2, spokeToHubDestinationMailbox);

        MockInterchainGasPaymaster mockIGP = new MockInterchainGasPaymaster();
        MockGasOracle mockGasOracle = new MockGasOracle();
        
        eventProver = new EventProver(
            address(mockMailbox),
            address(0x1234),
            2,
            address(mockIGP),
            address(mockGasOracle)
        );

        spokePublisher = new SpokePublisher(hubChainId);
        spokePublisher.addProducer(producer);
        spokePublisher.registerEventProver(hubChainId, address(eventProver));
        eventProver.addEventPublisher(address(spokePublisher));

        vm.stopPrank();
        exampleEventType = keccak256(abi.encode(producer, exampleEventTypeHash));
    }

    function testPublishEventRevertsWrongChain() public {
        bytes32 eventType = keccak256(abi.encode(producer, keccak256("FakeEvent")));
        vm.prank(owner);
        spokePublisher.registerEventOnProducer(producer, eventType);

        vm.startPrank(producer);
        vm.expectRevert(abi.encodeWithSignature("SpokePublisher__InvalidDestination()"));
        spokePublisher.publishEvent(abi.encode("data"), eventType, /*wrongChainId=*/200);
        vm.stopPrank();
    }

    function testPublishEventRevertsIfNotProducer() public {
        bytes32 eventType = keccak256(abi.encode(producer, keccak256("FakeEvent")));
        vm.prank(owner);
        spokePublisher.registerEventOnProducer(producer, eventType);

        vm.startPrank(address(0xBAD));
        vm.expectRevert(
            abi.encodeWithSignature("SpokePublisher__EventProducerNotAuthorized(address)", address(0xBAD))
        );
        spokePublisher.publishEvent(abi.encode("data"), eventType, hubChainId);
        vm.stopPrank();
    }

    function testRegisterEventProverOnlyOwner() public {
        vm.startPrank(address(0xBAD));
        vm.expectRevert("Ownable: caller is not the owner");
        spokePublisher.registerEventProver(hubChainId, address(0x999));
    }

    function testPublishEventRevertIfWrongDestinationChain() public {
        vm.startPrank(owner);
        spokePublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();
        uint32 unregisteredChain = 99;
        vm.startPrank(producer);
        vm.expectRevert(abi.encodeWithSignature("SpokePublisher__InvalidDestination()"));
        spokePublisher.publishEvent(abi.encode("dummy"), exampleEventType, unregisteredChain);
        vm.stopPrank();
    }

    function testRegisterEventProverRevertIfAlreadyRegistered() public {
        vm.startPrank(owner);
        vm.expectRevert(abi.encodeWithSignature("SpokePublisher__EventProverAlreadyRegistered()"));
        spokePublisher.registerEventProver(hubChainId, address(eventProver));
        vm.stopPrank();
    }

    function testRegisterEventOnProducerTwiceReverts() public {
        vm.startPrank(owner);
        spokePublisher.registerEventOnProducer(producer, exampleEventType);
        vm.expectRevert(
            abi.encodeWithSignature("SpokePublisher__EventTypeAlreadyRegistered(bytes32)", exampleEventType)
        );
        spokePublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();
    }

    function testPublishEventSuccess() public {
        vm.startPrank(owner);
        spokePublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();

        vm.deal(producer, 1 ether);
        vm.startPrank(producer);
        spokePublisher.publishEvent{value: 0.1 ether}(abi.encode("payload"), exampleEventType, hubChainId);
        vm.stopPrank();
    }
}