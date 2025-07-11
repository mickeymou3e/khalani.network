pragma solidity ^0.8.0;

import "../Token.sol";


interface IMessageReceiver{
    /**
    * @dev receive a message from Khalani's IM
    * @param _tokens the tokens received
    * @param _message the message payload
    */
    function onMessageReceive(
        uint256 _chainId,
        address _sender,
        Token[] memory _tokens,
        bytes calldata _message
    ) external;
    //should we transfer or just approve and then receiver should pull ?
}