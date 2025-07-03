pragma solidity ^0.8.0;

library SpokeChainCallEventLibrary {

    struct SpokeCalled {
        address caller;
        bytes32 spokeChainCallIntentId;
        address contractToCall;
        bytes callData;
        address token;
        uint256 amount;
    }

    function calculateSpokeCalledEventHash(SpokeCalled memory _event) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "SpokeCalled",
                _event.caller,
                _event.spokeChainCallIntentId,
                _event.contractToCall,
                _event.callData,
                _event.token,
                _event.amount
            )
        );
    }
}