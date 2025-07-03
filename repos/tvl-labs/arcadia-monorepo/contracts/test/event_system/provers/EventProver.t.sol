// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Test} from "forge-std/Test.sol";
import {EventProver} from "../../../src/event_system/EventProver.sol";
import {XChainEvent} from "../../../src/types/Events.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {MockInterchainGasPaymaster} from "../../MockInterchainGasPaymaster.sol";

contract MockGasOracle {
    function getGasAmount(uint32 sourceChainId, uint32 destinationChainId) external view returns (uint256) {
        return 100000;
    }
}

contract EventProverTests is Test {
    EventProver internal eventProver;
    address internal owner = address(0x111);
    address internal publisher = address(0x222);
    XChainEvent internal xEvent;

    function setUp() public {
        vm.prank(owner);
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
        eventProver.addEventPublisher(publisher);

        xEvent = XChainEvent({
            publisher: address(0x999),
            originChainId: 1,
            eventHash: keccak256("testEvent"),
            eventData: abi.encode("test data"),
            eventNonce: uint256(1)
        });
    }

    function testRegisterEventRevertIfNotPublisher() public {
        vm.prank(address(0xBAD));
        vm.deal(address(0xBAD), 1 ether);
        vm.expectRevert(abi.encodeWithSignature("EventProver__UnauthorizedEventPublisher()"));
        eventProver.registerEvent{value: 0.1 ether}(xEvent);
    }

    function testRegisterEventSuccess() public {
        vm.startPrank(publisher);
        vm.deal(publisher, 1 ether);
        eventProver.registerEvent{value: 0.1 ether}(xEvent);
        assertTrue(eventProver.isEventRegistered(keccak256(abi.encode(xEvent))));
        vm.stopPrank();
    }

    function testRegisterEventAlreadyRegistered() public {
        vm.startPrank(publisher);
        vm.deal(publisher, 1 ether);
        eventProver.registerEvent{value: 0.1 ether}(xEvent);
        vm.expectRevert(abi.encodeWithSignature("EventProver__EventAlreadyRegistered()"));
        eventProver.registerEvent{value: 0.1 ether}(xEvent);
        vm.stopPrank();
    }
}