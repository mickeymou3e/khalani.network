pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../../../src/event_system/EventVerifier.sol";
import "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {XChainEvent} from "../../../src/types/Events.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {SpokeHandler} from "../../../src/event_system/SpokeHandler.sol";
import {IEventProcessor} from "../../../src/event_system/interfaces/IEventProcessor.sol";
import {MockProcessor} from "../../utils/MockProcessor.sol";

contract EventVerifierTests is Test {
    EventVerifier internal eventVerifier;
    MockMailbox internal mockMailbox;
    SpokeHandler internal spokeHandler;
    address internal handler = address(0xAAA);
    uint32 internal localDomain = 1;
    uint32 internal remoteDomain = 2;

    function setUp() public {
        mockMailbox = new MockMailbox(localDomain);
        spokeHandler = new SpokeHandler(localDomain);
        eventVerifier = new EventVerifier(address(mockMailbox), address(spokeHandler));
        spokeHandler.registerEventVerifier(address(eventVerifier));
        MockProcessor pongProcessor = new MockProcessor();
        spokeHandler.registerEventProcessor(address(pongProcessor));
        spokeHandler.registerEventType(address(pongProcessor), keccak256("testHash"));
        spokeHandler.registerEventType(address(pongProcessor), keccak256(abi.encode("whatever")));
        eventVerifier.addRemoteProver(address(0xDEAD));
        eventVerifier.addRemoteProver(address(0xBEF));
    }

    function testHandleRevertIfNotMailbox() public {
        vm.expectRevert(bytes("EventVerifier: caller must be the mailbox"));
        eventVerifier.handle(100, bytes32("sender"), abi.encode("test message"));
    }

    function testHandleRevertIfAlreadyVerified() public {
        XChainEvent memory ev = XChainEvent({
            publisher: address(this),
            originChainId: 1111,
            eventHash: keccak256("testHash"),
            eventData: abi.encode("testData"),
            eventNonce: uint256(1)
        });

        bytes memory encodedMsg = abi.encode(ev);
        bytes32 eventHash = keccak256(encodedMsg);

        vm.prank(address(mockMailbox));
        eventVerifier.handle(localDomain, TypeCasts.addressToBytes32(address(0xDEAD)), encodedMsg);

        vm.prank(address(mockMailbox));
        vm.expectRevert(EventVerifier.EventAlreadyVerified.selector);
        eventVerifier.handle(localDomain, TypeCasts.addressToBytes32(address(0xDEAD)), encodedMsg);
    }

    function testVerifyEventMatchesInternalStorage() public {
        bytes32 dummyHash = keccak256(abi.encode("whatever"));
        bool verified = eventVerifier.isEventVerified(dummyHash);
        assertFalse(verified, "Expected unverified at start.");

        XChainEvent memory ev = XChainEvent({
            publisher: address(this),
            originChainId: 1111,
            eventHash: dummyHash,
            eventData: abi.encode("some data"),
            eventNonce: uint256(1)
        });
        bytes memory encoded = abi.encode(ev);

        bytes32 expectedStoredHash = keccak256(encoded);

        vm.prank(address(mockMailbox));
        eventVerifier.handle(localDomain, TypeCasts.addressToBytes32(address(0xBEF)), encoded);

        bool verifiedAfter = eventVerifier.isEventVerified(expectedStoredHash);
        assertTrue(verifiedAfter, "Expected verified event after handle");

        bool originalHashVerified = eventVerifier.isEventVerified(dummyHash);
        assertFalse(originalHashVerified, "Original hash should remain unverified");
    }
}
