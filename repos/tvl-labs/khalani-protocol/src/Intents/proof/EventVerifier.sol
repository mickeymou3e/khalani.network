pragma solidity ^0.8.4;

abstract contract EventVerifier {

    /**
     * @dev Verification of the proof of event/eventhash
     * @param eventHash The hash of an event proof
     * @return A boolean indicating whether the eventHash is registered
     */
    function verify(bytes32 eventHash) external virtual returns (bool);
}