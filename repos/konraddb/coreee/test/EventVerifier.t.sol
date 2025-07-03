
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/common/EventVerifier.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";


contract EventVerifierTest is Test {
    EventVerifier public eventVerifier;
    MockMailbox public originMailbox;
    MockMailbox public destinationMailbox;
    address mailboxAddress;

    // Sample test values
    address publisher = 0x4841d269Df0562fbD46399a253d3cf8ffCAb2757;
    uint32 constant originChainId = 17000;
    uint32 constant destinationChainId = 43113;
    bytes32 eventHash = 0x93ea3148bb81a197956e59a6c88d2e80380a1a9667de2587273b173e898e99a0;
    bytes32 sender = 0x0000000000000000000000005f4470e111c7549b719a77fc4eb1b81b43a5b856;
    bytes eventData = hex"0000000000000000000000004722ce3a7195dee57cec78edf5ac9c542fbc46260000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000c13113e56e00050327be3ad164185103541f1903";

    function setUp() public {
        mailboxAddress = address(this);
        originMailbox = new MockMailbox(originChainId);
        destinationMailbox = new MockMailbox(destinationChainId);
        originMailbox.addRemoteMailbox(destinationChainId, destinationMailbox);

        eventVerifier = new EventVerifier(address(originMailbox));
    }

    function testHandleFunction() public {
        // Encode the XChainEvent as the `_message` parameter
        XChainEvent memory xChainEvent = XChainEvent(publisher, originChainId, eventHash, eventData);
        bytes memory encodedMessage = abi.encode(xChainEvent);

        // Simulate calling `handle`
        vm.prank(address(originMailbox));
        eventVerifier.handle(originChainId, sender, encodedMessage);

        bytes32 computedEventHash = keccak256(abi.encode(xChainEvent));
    }
}