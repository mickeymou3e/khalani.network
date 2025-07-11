pragma solidity ^0.8.0;

import "../../src/InterchainMessaging/interfaces/IRequestProcessorFacet.sol";

contract MockNexus is IRequestProcessorFacet{

    event ProcessRequestCalled(
        uint256 _origin,
        bytes32 _sender,
        bytes _message
    );

    function processRequest(
        uint256 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external override {
        emit ProcessRequestCalled(_origin, _sender, _message);
    }

}