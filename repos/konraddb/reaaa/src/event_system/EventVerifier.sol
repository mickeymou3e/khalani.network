// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventVerifier} from "./interfaces/IEventVerifier.sol";
import {XChainEvent} from "../types/Events.sol";
import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {IEventHandler} from "./interfaces/IEventHandler.sol";

contract EventVerifier is IEventVerifier {
    error EventAlreadyVerified();

    IMailbox public immutable mailbox;
    uint32 public immutable localDomain;
    address public immutable i_eventHandler;

    mapping(bytes32 => bool) private verifiedEvents;

    event HandleCalled(uint32 indexed originDomain, bytes32 indexed sender, bytes message);
    event EventVerified(bytes32 indexed eventHash, uint32 originDomain, address sender);
    event Received(address indexed sender);

    constructor(address _mailbox, address _eventHandler) {
        mailbox = IMailbox(_mailbox);
        localDomain = mailbox.localDomain();
        i_eventHandler = _eventHandler;
    }

    function verifyEvent(bytes32 eventHash) external override returns (bool) {
        // In a real implementation, we would verify the event using Hyperlane's
        // interchain security module. For simplicity, we'll just check if the
        // event has been marked as verified.
        return verifiedEvents[eventHash];
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external payable {
        emit HandleCalled(_origin, _sender, _message);
        require(msg.sender == address(mailbox), "EventVerifier: caller must be the mailbox");
        bytes32 eventHash = keccak256(_message);
        if (verifiedEvents[eventHash]) {
            revert EventAlreadyVerified();
        }
        // Mark the event as verified
        verifiedEvents[eventHash] = true;
        XChainEvent memory ev = abi.decode(_message, (XChainEvent));

        IEventHandler(i_eventHandler).handleEvent(ev, _origin);
        // Emit the original event indicating successful handling
        emit EventVerified(eventHash, _origin, TypeCasts.bytes32ToAddress(_sender));
    }

    receive() external payable {
        emit Received(msg.sender);
    }
}
