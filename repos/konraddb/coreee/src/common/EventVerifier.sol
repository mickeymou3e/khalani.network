// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {XChainEvent} from "../types/Events.sol";
import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

contract EventVerifier is IEventVerifier {
    IMailbox public immutable mailbox;
    uint32 public immutable localDomain;

    mapping(bytes32 => bool) private verifiedEvents;

    event HandleCalled(uint32 indexed originDomain, bytes32 indexed sender, bytes message);
    event EventVerified(bytes32 indexed eventHash, uint32 originDomain, address sender);

    constructor(address _mailbox) {
        mailbox = IMailbox(_mailbox);
        localDomain = mailbox.localDomain();
    }

    function verifyEvent(bytes32 eventHash) external override returns (bool) {
        // In a real implementation, we would verify the event using Hyperlane's
        // interchain security module. For simplicity, we'll just check if the
        // event has been marked as verified.
        return verifiedEvents[eventHash];
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external {
        emit HandleCalled(_origin, _sender, _message);
        require(msg.sender == address(mailbox), "EventVerifier: caller must be the mailbox");

        XChainEvent memory ev = abi.decode(_message, (XChainEvent));
        bytes32 eventHash = keccak256(abi.encode(ev));

        // Mark the event as verified
        verifiedEvents[eventHash] = true;

        // Emit the original event indicating successful handling
        emit EventVerified(eventHash, _origin, TypeCasts.bytes32ToAddress(_sender));
    }
}
