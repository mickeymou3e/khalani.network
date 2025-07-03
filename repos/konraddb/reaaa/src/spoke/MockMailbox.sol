// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../common/EventVerifier.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import "@hyperlane-xyz/core/contracts/interfaces/hooks/IPostDispatchHook.sol";

contract MockMailbox is IMailbox {
    EventVerifier public eventVerifier;
    uint32 private _localDomain;

    mapping(bytes32 => bool) private deliveredMessages;

    constructor(uint32 localDomain) {
        _localDomain = localDomain;
    }

    function setEventVerifier(address _eventVerifier) external {
        require(address(eventVerifier) == address(0), "EventVerifier already set");
        require(_eventVerifier != address(0), "Invalid EventVerifier address");

        eventVerifier = EventVerifier(_eventVerifier);
    }

    function localDomain() external view override returns (uint32) {
        return _localDomain;
    }

    function delivered(bytes32 messageId) external view override returns (bool) {
        return deliveredMessages[messageId];
    }

    function defaultIsm() external view override returns (IInterchainSecurityModule) {
        revert("MockMailbox: Not implemented");
    }

    function defaultHook() external view override returns (IPostDispatchHook) {
        revert("MockMailbox: Not implemented");
    }

    function requiredHook() external view override returns (IPostDispatchHook) {
        revert("MockMailbox: Not implemented");
    }

    function latestDispatchedId() external view override returns (bytes32) {
        revert("MockMailbox: Not implemented");
    }

    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable override returns (bytes32 messageId) {
        // Emit Dispatch events as part of the mock
        messageId = keccak256(
            abi.encodePacked(destinationDomain, recipientAddress, messageBody, block.timestamp)
        );
        emit Dispatch(msg.sender, destinationDomain, recipientAddress, messageBody);
        emit DispatchId(messageId);
    }

    function quoteDispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external view override returns (uint256 fee) {
        revert("MockMailbox: Not implemented");
    }

    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata body,
        bytes calldata defaultHookMetadata
    ) external payable override returns (bytes32 messageId) {
        revert("MockMailbox: Not implemented");
    }

    function quoteDispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody,
        bytes calldata defaultHookMetadata
    ) external view override returns (uint256 fee) {
        revert("MockMailbox: Not implemented");
    }

    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata body,
        bytes calldata customHookMetadata,
        IPostDispatchHook customHook
    ) external payable override returns (bytes32 messageId) {
        revert("MockMailbox: Not implemented");
    }

    function quoteDispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody,
        bytes calldata customHookMetadata,
        IPostDispatchHook customHook
    ) external view override returns (uint256 fee) {
        revert("MockMailbox: Not implemented");
    }

    function process(
        bytes calldata metadata,
        bytes calldata message
    ) external payable override {
        revert("MockMailbox: Not implemented");
    }

    function recipientIsm(
        address recipient
    ) external view override returns (IInterchainSecurityModule module) {
        revert("MockMailbox: Not implemented");
    }

    // Dispatch message to EventVerifier
    function dispatchMessage(uint32 _origin, bytes32 _sender, bytes calldata _message) external {
        require(address(eventVerifier) != address(0), "EventVerifier not set");
        eventVerifier.handle(_origin, _sender, _message);
    }
}