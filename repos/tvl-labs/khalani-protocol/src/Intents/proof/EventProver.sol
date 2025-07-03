pragma solidity ^0.8.4;

abstract contract EventProver {
    /**
     * @dev Registers the event hash of the event. Implementations of this contract
     * may restrict calling the 'registerEvent' function to only those holding a "registerer" role.
     * @param eventHash The hash of the event to be registered.
     */
    function registerEvent(bytes32 eventHash) public virtual;
}