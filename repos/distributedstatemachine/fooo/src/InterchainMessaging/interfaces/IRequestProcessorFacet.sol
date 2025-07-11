pragma solidity ^0.8.0;

interface IRequestProcessorFacet {
    /**
    * @dev process a request from Adapter
    * @param _origin the origin chain
    * @param _sender the sender on the origin chain
    * @param _message the message payload
    */
    function processRequest(
        uint256 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external;
}