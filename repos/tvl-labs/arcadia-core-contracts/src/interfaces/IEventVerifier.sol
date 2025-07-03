// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IEventVerifier {
    function verifyEvent(bytes32 eventHash) external returns (bool);
}
