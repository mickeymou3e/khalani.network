// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Test} from "forge-std/Test.sol";
import {HubPublisher} from "../../../src/event_system/HubPublisher.sol";
import {MockInterchainGasPaymaster} from "../../MockInterchainGasPaymaster.sol";
import {MockGasOracle} from "../../utils/MockGasOracle.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {EventProver} from "../../../src/event_system/EventProver.sol";
import {SpokeHandler} from "../../../src/event_system/SpokeHandler.sol";
import {IEventVerifier} from "../../../src/event_system/interfaces/IEventVerifier.sol";

contract MockEventVerifier is IEventVerifier {
    function isEventVerified(bytes32 eventHash) external view returns (bool) {
        return true;
    }
}

contract HubPublisherTests is Test {
    HubPublisher internal hubPublisher;
    SpokeHandler internal spokeHandler;
    address internal owner = address(0x123);
    EventProver internal eventProver;
    MockEventVerifier internal eventVerifier;
    address internal producer = address(0x789);
    address internal notProducer = address(0x333);

    uint32 internal hubChainId = 100;
    uint32 internal spokeChainId = 2;
    bytes32 internal exampleEventTypeHash = keccak256("ExampleTypeHash");
    bytes32 internal exampleEventType;

    function setUp() public {
        vm.startPrank(owner);
        MockMailbox mockMailbox = new MockMailbox(1);
        MockMailbox spokeToHubDestinationMailbox = new MockMailbox(2);
        mockMailbox.addRemoteMailbox(2, spokeToHubDestinationMailbox);
        spokeHandler = new SpokeHandler(hubChainId);
        MockEventVerifier mockEventVerifier = new MockEventVerifier();
        MockInterchainGasPaymaster mockIGP = new MockInterchainGasPaymaster();
        MockGasOracle mockGasOracle = new MockGasOracle();

        eventProver =
            new EventProver(address(mockMailbox), address(eventVerifier), 2, address(mockIGP), address(mockGasOracle));

        hubPublisher = new HubPublisher();
        hubPublisher.addProducer(producer);
        hubPublisher.registerEventProver(spokeChainId, address(eventProver));
        eventProver.addEventPublisher(address(hubPublisher));
        vm.stopPrank();

        exampleEventType = keccak256(abi.encode(producer, exampleEventTypeHash));
    }

    function testPublishEventRevertsIfNotProducer() public {
        bytes32 eventType = keccak256(abi.encode(producer, keccak256("FakeEvent")));
        vm.prank(owner);
        hubPublisher.registerEventOnProducer(producer, eventType);

        vm.startPrank(address(0xBAD));
        vm.expectRevert(abi.encodeWithSignature("HubPublisher__EventProducerNotAuthorized(address)", address(0xBAD)));
        hubPublisher.publishEvent(abi.encode("data"), eventType, hubChainId);
        vm.stopPrank();
    }

    function testRegisterEventProverOnlyOwner() public {
        vm.startPrank(address(0xBAD));
        vm.expectRevert("Ownable: caller is not the owner");
        hubPublisher.registerEventProver(hubChainId, address(0x999));
    }

    function testPublishEventRevertIfNoProverForChain() public {
        vm.startPrank(owner);
        hubPublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();
        uint32 unregisteredChain = 99;
        vm.startPrank(producer);
        vm.expectRevert(abi.encodeWithSignature("HubPublisher__EventProverNotRegistered()"));
        hubPublisher.publishEvent(abi.encode("dummy"), exampleEventType, unregisteredChain);
        vm.stopPrank();
    }

    function testRegisterEventProverRevertIfAlreadyRegistered() public {
        vm.startPrank(owner);
        vm.expectRevert(abi.encodeWithSignature("HubPublisher__EventProverAlreadyRegistered()"));
        hubPublisher.registerEventProver(hubChainId, address(eventProver));
        vm.stopPrank();
    }

    function testRegisterEventOnProducerTwiceReverts() public {
        vm.startPrank(owner);
        hubPublisher.registerEventOnProducer(producer, exampleEventType);
        vm.expectRevert(abi.encodeWithSignature("HubPublisher__EventTypeAlreadyRegistered(bytes32)", exampleEventType));
        hubPublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();
    }

    function testPublishEventSuccess() public {
        vm.startPrank(owner);
        hubPublisher.registerEventOnProducer(producer, exampleEventType);
        vm.stopPrank();

        vm.deal(producer, 1 ether);
        vm.startPrank(producer);
        hubPublisher.publishEvent{value: 0.1 ether}(abi.encode("payload"), exampleEventType, spokeChainId);
        vm.stopPrank();
    }
}
