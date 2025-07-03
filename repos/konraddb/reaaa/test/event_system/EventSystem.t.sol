// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {SpokeHandler} from "../../src/event_system/SpokeHandler.sol";
import {HubPublisher} from "../../src/event_system/HubPublisher.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";
import {XChainEvent} from "../../src/types/Events.sol";
import {MockInterchainGasPaymaster} from "../MockInterchainGasPaymaster.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import "../../src/event_system/interfaces/IEventProcessor.sol";
import "../../src/event_system/interfaces/IEventPublisher.sol";
import "../../src/event_system/interfaces/IEventProver.sol";

// Mock PongProcessor to simulate handling events
contract MockPongProcessor is IEventProcessor {
    event PongReceived(address sender, string message);

    function processEvent(XChainEvent calldata ev, uint32 originChain) external override {
        (string memory message, address originalSender) = abi.decode(ev.eventData, (string, address));
        emit PongReceived(originalSender, string(abi.encodePacked(message, " received")));
    }
}

contract MockGasOracle {
    function getGasAmount(uint32 sourceChainId, uint32 destinationChainId) external view returns (uint256) {
        return 100000;
    }
}

contract PingPongE2ETest is Test {
    SpokePublisher spokePublisher;
    SpokeHandler spokeHandler;
    HubPublisher hubPublisher;
    HubHandler hubHandler;
    MockPongProcessor pongProcessor;
    MockGasOracle gasOracle;
    MockMailbox spokeToHubOriginMailbox;
    MockMailbox spokeToHubDestinationMailbox;
    MockMailbox hubToSpokeOriginMailbox;
    MockMailbox hubToSpokeDestinationMailbox;

    address owner = address(0x123);
    address pingProducer = address(0x456);
    address mTokenManager = address(0x789);
    EventVerifier eventVerifierSpokeToHub;
    EventVerifier eventVerifierHubToSpoke;

    uint32 spokeChainId = 1;
    uint32 hubChainId = 2;

    bytes32 pingEventType = keccak256(abi.encode(address(0x456), keccak256("PingEvent")));
    bytes32 withdrawalEventType = keccak256("MTokenWithdrawal(address,uint256,address)");

    event PongReceived(address sender, string message);

    function setUp() public {
        vm.startPrank(owner);

        // Deploy publishers and handlers
        hubPublisher = new HubPublisher();
        hubHandler = new HubHandler();

        spokePublisher = new SpokePublisher(hubChainId);
        spokeHandler = new SpokeHandler();

        pongProcessor = new MockPongProcessor();

        // -------------------------------
        // SPOKE -> HUB SETUP
        // -------------------------------
        // Mailboxes for spoke->hub direction
        spokeToHubOriginMailbox = new MockMailbox(spokeChainId);
        spokeToHubDestinationMailbox = new MockMailbox(hubChainId);
        spokeToHubOriginMailbox.addRemoteMailbox(hubChainId, spokeToHubDestinationMailbox);

        // EventVerifier for spoke->hub
        eventVerifierSpokeToHub = new EventVerifier(address(spokeToHubDestinationMailbox), address(hubHandler));

        MockInterchainGasPaymaster interchainGasPaymaster = new MockInterchainGasPaymaster();
        gasOracle = new MockGasOracle();
        // EventProver for spoke->hub
        EventProver proverSpokeToHub = new EventProver(
            address(spokeToHubOriginMailbox),
            address(eventVerifierSpokeToHub),
            hubChainId,
            address(interchainGasPaymaster),
            address(gasOracle)
        );

        // Register the verifier on hubHandler
        hubHandler.registerEventVerifier(address(eventVerifierSpokeToHub));

        // Authorize spokePublisher as a publisher on proverSpokeToHub
        proverSpokeToHub.addEventPublisher(address(spokePublisher));

        // Register proverSpokeToHub on spokePublisher for sending events to hubChainId
        spokePublisher.registerEventProver(hubChainId, address(proverSpokeToHub));

        // -------------------------------
        // HUB -> SPOKE SETUP
        // -------------------------------
        // Mailboxes for hub->spoke direction
        hubToSpokeOriginMailbox = new MockMailbox(hubChainId);
        hubToSpokeDestinationMailbox = new MockMailbox(spokeChainId);
        hubToSpokeOriginMailbox.addRemoteMailbox(spokeChainId, hubToSpokeDestinationMailbox);

        // EventVerifier for hub->spoke
        eventVerifierHubToSpoke = new EventVerifier(address(hubToSpokeDestinationMailbox), address(spokeHandler));

        // EventProver for hub->spoke
        EventProver proverHubToSpoke = new EventProver(
            address(hubToSpokeOriginMailbox),
            address(eventVerifierHubToSpoke),
            spokeChainId,
            address(interchainGasPaymaster),
            address(gasOracle)
        );

        // Register the verifier on spokeHandler
        spokeHandler.registerEventVerifier(address(eventVerifierHubToSpoke));

        // Authorize hubPublisher as a publisher on proverHubToSpoke
        proverHubToSpoke.addEventPublisher(address(hubPublisher));

        // Register proverHubToSpoke on hubPublisher for sending events to spokeChainId
        hubPublisher.registerEventProver(spokeChainId, address(proverHubToSpoke));

        // -------------------------------
        // PRODUCERS & EVENT TYPES SETUP
        // -------------------------------
        // Add producers on spokePublisher
        spokePublisher.addProducer(pingProducer);
        spokePublisher.addProducer(mTokenManager);

        // Add producer on hubPublisher for hub->spoke direction
        hubPublisher.addProducer(mTokenManager);

        // Register event types on spokePublisher
        spokePublisher.registerEventOnProducer(pingProducer, pingEventType);
        spokePublisher.registerEventOnProducer(mTokenManager, withdrawalEventType);

        // -------------------------------
        // PROCESSOR SETUP
        // -------------------------------
        // Register PongProcessor on HubHandler for ping and withdrawal events
        hubHandler.registerEventProcessor(address(pongProcessor));
        hubHandler.registerEventType(address(pongProcessor), pingEventType);
        hubHandler.registerEventType(address(pongProcessor), withdrawalEventType);

        spokeHandler.registerEventProcessor(address(pongProcessor));
        spokeHandler.registerEventType(address(pongProcessor), withdrawalEventType);
        spokeHandler.registerEventType(address(pongProcessor), pingEventType);
        vm.stopPrank();
    }

    function testPingPongFlowE2E() public {
        vm.startPrank(pingProducer);
        vm.deal(pingProducer, 1 ether);

        // Prepare the Ping Event for spoke->hub
        string memory pingMessage = "Ping!";
        bytes memory eventData = abi.encode(pingMessage, pingProducer);

        // Publish Ping Event on Spoke (to hubChainId)
        spokePublisher.publishEvent{value: 0.1 ether}(eventData, pingEventType, hubChainId);
        vm.stopPrank();

        // Expect PongReceived after relay (spoke->hub direction)
        vm.expectEmit(true, true, false, true);
        emit PongReceived(pingProducer, "Ping! received");

        // Process the message on the hub side
        // This triggers EventVerifier -> HubHandler -> PongProcessor
        spokeToHubDestinationMailbox.processNextInboundMessage();
    }

    function testMTokenWithdrawalSimulation() public {
        vm.startPrank(mTokenManager);
        vm.deal(mTokenManager, 1 ether);

        // MTokenWithdrawal event for hub->spoke
        string memory withdrawalMessage = "Withdrawal Event";
        bytes memory eventData = abi.encode(withdrawalMessage, mTokenManager);

        // Publish withdrawal event on Hub (to spokeChainId)
        hubPublisher.publishEvent{value: 0.1 ether}(eventData, withdrawalEventType, spokeChainId);
        vm.stopPrank();

        // Expect PongReceived after relay (hub->spoke direction)
        vm.expectEmit(true, true, false, true);
        emit PongReceived(mTokenManager, "Withdrawal Event received");

        // Process the message on the spoke side
        // This triggers EventVerifier -> SpokeHandler -> PongProcessor
        hubToSpokeDestinationMailbox.processNextInboundMessage();
    }

    // function testFailingEventVerifierCall() public {
    //     bytes memory callData =
    //         hex"56d5d47500000000000000000000000000000000000000000000000000000000000042680000000000000000000000002b738b25406a82f2d0b81917d40df36bdaad0110000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ec4738a92b572ea9c77dddcf94369a0b888cf40b0000000000000000000000000000000000000000000000000000000000004268a9aadfb3174f3e4169a1420fd724f12d588298c0c9812d43c25077cfe5605315000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004722ce3a7195dee57cec78edf5ac9c542fbc46260000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000c13113e56e00050327be3ad164185103541f19030000000000000000000000000000000000000000000000000000000000000000";

    //     vm.startPrank(address(spokeToHubDestinationMailbox));
    //     (bool success,) = address(eventVerifierSpokeToHub).call(callData);
    //     require(!success, "Call should fail");
    //     vm.stopPrank();
    // }
}
