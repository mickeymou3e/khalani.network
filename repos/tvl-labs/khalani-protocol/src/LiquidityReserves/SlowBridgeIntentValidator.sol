pragma solidity ^0.8.4;

abstract contract SlowBridgeIntentValidator {

    mapping(bytes32 => bool) public settledIntents;

    function _markIntentSettled(bytes32 intentId) internal {
        settledIntents[intentId] = true;
    }

    function isSettled(bytes32 intentId) public view returns (bool) {
        return settledIntents[intentId];
    }

}