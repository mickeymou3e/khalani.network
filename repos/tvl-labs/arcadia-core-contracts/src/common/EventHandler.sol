// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {XChainEvent} from "../types/Events.sol";

abstract contract EventHandler {
    error EventHandler__InvalidEvent();
    error EventHandler__EventAlreadyHandled(bytes32 eventHash);

    IEventVerifier private immutable i_eventVerifier;
    mapping(bytes32 eventHash => bool handled) private _handledEvents;

    constructor(IEventVerifier eventVerifier) {
        i_eventVerifier = eventVerifier;
    }

    function _handleEvent(XChainEvent memory _event) internal {
        if (!i_eventVerifier.verifyEvent(_event.eventHash)) {
            revert EventHandler__InvalidEvent();
        }
        if (_handledEvents[_event.eventHash]) {
            revert EventHandler__EventAlreadyHandled(_event.eventHash);
        }
        _handledEvents[_event.eventHash] = true;
        _handle(_event);
    }

    function _handle(XChainEvent memory _event) internal virtual;
}
