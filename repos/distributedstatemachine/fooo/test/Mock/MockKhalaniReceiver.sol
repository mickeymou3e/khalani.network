pragma solidity ^0.8.0;

import "../../src/InterchainMessaging/interfaces/IMessageReceiver.sol";

contract MockKhalaniReceiver is IMessageReceiver {
    event Received(uint chainId, address sender, Token[] tokens);

    function onMessageReceive(
        uint256 _chainId,
        address _sender,
        Token[] memory _tokens,
        bytes calldata _message
    ) external override {
        emit Received(_chainId, _sender, _tokens);
    }
}