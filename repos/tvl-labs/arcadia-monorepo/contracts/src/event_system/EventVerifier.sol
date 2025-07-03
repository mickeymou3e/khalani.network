// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IEventVerifier} from "./interfaces/IEventVerifier.sol";
import {XChainEvent} from "../types/Events.sol";
import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {IEventHandler} from "./interfaces/IEventHandler.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EventVerifier is IEventVerifier, Ownable {
    // ***************** //
    // *** ERRORS *** //
    // ***************** //
    error EventAlreadyVerified();
    error OnlyVerifiedSendersAllowed();

    // ***************** //
    // *** EVENTS *** //
    // ***************** //
    event HandleCalled(uint32 indexed originDomain, bytes32 indexed sender, bytes message);
    event EventVerified(bytes32 indexed eventHash, uint32 originDomain, address sender);
    event Received(address indexed sender);
    // ***************** //
    // *** VARIABLES *** //
    // ***************** //

    IMailbox public immutable mailbox;
    uint32 public immutable localDomain;
    address public s_eventHandler;

    mapping(bytes32 => bool) private verifiedEvents;
    mapping(address => bool) private verifiedSenders;

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    constructor(address _mailbox, address _eventHandler) Ownable() {
        mailbox = IMailbox(_mailbox);
        localDomain = mailbox.localDomain();
        s_eventHandler = _eventHandler;
    }

    receive() external payable {
        emit Received(msg.sender);
    }

    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //

    function setEventHandler(address _eventHandler) external onlyOwner {
        s_eventHandler = _eventHandler;
    }

    function isEventVerified(bytes32 eventHash) external view returns (bool) {
        return verifiedEvents[eventHash];
    }

    function addRemoteProver(address sender) external onlyOwner {
        verifiedSenders[sender] = true;
    }

    function removeRemoteProver(address sender) external onlyOwner {
        verifiedSenders[sender] = false;
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external payable {
        emit HandleCalled(_origin, _sender, _message);
        require(msg.sender == address(mailbox), "EventVerifier: caller must be the mailbox");
        if (!verifiedSenders[TypeCasts.bytes32ToAddress(_sender)]) {
            revert OnlyVerifiedSendersAllowed();
        }
        bytes32 eventHash = keccak256(_message);
        if (verifiedEvents[eventHash]) {
            revert EventAlreadyVerified();
        }
        // Mark the event as verified
        verifiedEvents[eventHash] = true;
        XChainEvent memory ev = abi.decode(_message, (XChainEvent));

        IEventHandler(s_eventHandler).handleEvent(ev, _origin);
        // Emit the original event indicating successful handling
        emit EventVerified(eventHash, _origin, TypeCasts.bytes32ToAddress(_sender));
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
