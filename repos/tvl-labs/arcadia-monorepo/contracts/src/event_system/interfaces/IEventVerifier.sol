// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IEventVerifier {
    function isEventVerified(bytes32 eventHash) external view returns (bool);
}
