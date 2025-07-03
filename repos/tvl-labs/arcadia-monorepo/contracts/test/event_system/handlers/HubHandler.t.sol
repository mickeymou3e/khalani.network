// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Test} from "forge-std/Test.sol";
import {HubHandler} from "../../../src/event_system/HubHandler.sol";
import {XChainEvent} from "../../../src/types/Events.sol";
import {MockProcessor} from "../../utils/MockProcessor.sol";

contract HubHandlerTests is Test {
    HubHandler internal hubHandler;
    address internal owner = address(0x123);
    address internal eventVerifier = address(0xABC);
    address internal eventVerifier2 = address(0xBEEF);
    MockProcessor internal eventProcessor;
    MockProcessor internal eventProcessor2;
    bytes32 internal exampleEventType = keccak256("SomeEventType");
    bytes32 internal invalidEventType = keccak256("InvalidEventType");
    bytes32 internal sampleEventType = keccak256("SAMPLE_EVENT_TYPE");

    function setUp() public {
        vm.startPrank(owner);
        hubHandler = new HubHandler();
        eventProcessor = new MockProcessor();
        eventProcessor2 = new MockProcessor();
        hubHandler.registerEventVerifier(eventVerifier);
        hubHandler.registerEventProcessor(address(eventProcessor));
        hubHandler.registerEventVerifier(eventVerifier2);
        hubHandler.registerEventProcessor(address(eventProcessor2));
        hubHandler.authorizeOriginChain(1);
        vm.stopPrank();
    }

    function testRegisterEventVerifierOnlyOwner() public {
        vm.startPrank(address(0x999));
        vm.expectRevert("Ownable: caller is not the owner");
        hubHandler.registerEventVerifier(address(0x222));
    }

    function testHandleEventRevertIfNotVerifier() public {
        XChainEvent memory ev = XChainEvent({
            publisher: address(0xBAD),
            originChainId: uint32(1),
            eventHash: keccak256("UnregisteredEventType"),
            eventData: abi.encode("Some data"),
            eventNonce: uint256(1)
        });

        vm.startPrank(address(0xBAD));
        vm.expectRevert(abi.encodeWithSignature("HubHandler__NotEventVerifier()"));
        hubHandler.handleEvent(ev, 1);
    }

    function testHandleEventRevertIfNoProcessor() public {
        XChainEvent memory ev = XChainEvent({
            publisher: address(0xBAD),
            originChainId: uint32(1),
            eventHash: keccak256("UnregisteredEventType"),
            eventData: abi.encode("Some data"),
            eventNonce: uint256(1)
        });

        vm.prank(eventVerifier);
        vm.expectRevert(abi.encodeWithSignature("HubHandler__NotEventProcessor()"));

        hubHandler.handleEvent(ev, 1);
    }

    function testRegisterEventTypeSuccess() public {
        vm.startPrank(owner);
        hubHandler.registerEventType(address(eventProcessor), exampleEventType);
        vm.stopPrank();
    }

    function testRegisterEventTypeAlreadyRegistered() public {
        vm.startPrank(owner);
        hubHandler.registerEventType(address(eventProcessor), exampleEventType);
        vm.expectRevert(abi.encodeWithSignature("HubHandler__EventTypeAlreadyRegistered()"));
        hubHandler.registerEventType(address(eventProcessor), exampleEventType);
        vm.stopPrank();
    }

    function testUnregisterEventVerifierOnlyOwner() public {
        vm.startPrank(address(0xBAD));
        vm.expectRevert("Ownable: caller is not the owner");
        hubHandler.unregisterEventVerifier(eventVerifier2);
        vm.stopPrank();
    }

    function testUnregisterEventTypeSuccess() public {
        vm.startPrank(owner);
        hubHandler.registerEventType(address(eventProcessor2), sampleEventType);
        hubHandler.unregisterEventType(sampleEventType);
        vm.stopPrank();
    }

    function testHandleEventRevertIfCallerNotVerifier() public {
        XChainEvent memory ev = XChainEvent({
            publisher: address(0xBAD),
            originChainId: uint32(1),
            eventHash: sampleEventType,
            eventData: abi.encode("Some data"),
            eventNonce: uint256(1)
        });
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSignature("HubHandler__NotEventVerifier()"));
        hubHandler.handleEvent(ev, 1);
    }

    function testHandleEventRevertIfNoProcessorForType() public {
        XChainEvent memory ev = XChainEvent({
            publisher: address(0xBAD),
            originChainId: uint32(1),
            eventHash: sampleEventType,
            eventData: abi.encode("Some data"),
            eventNonce: uint256(1)
        });
        vm.prank(eventVerifier2);
        vm.expectRevert(abi.encodeWithSignature("HubHandler__NotEventProcessor()"));
        hubHandler.handleEvent(ev, 1);
    }

    function testHandleEventSuccess() public {
        vm.startPrank(owner);
        hubHandler.registerEventType(address(eventProcessor2), sampleEventType);
        vm.stopPrank();

        XChainEvent memory ev = XChainEvent({
            publisher: address(0xBAD),
            originChainId: uint32(1),
            eventHash: sampleEventType,
            eventData: abi.encode("Some data"),
            eventNonce: uint256(1)
        });
        vm.prank(eventVerifier2);
        hubHandler.handleEvent(ev, 1);
    }
}
