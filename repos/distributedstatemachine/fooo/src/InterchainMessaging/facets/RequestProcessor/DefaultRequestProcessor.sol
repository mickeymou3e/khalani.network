pragma solidity ^0.8.0;

import "./AbstractRequestProcessor.sol";
import "../../interfaces/IMessageReceiver.sol";

contract DefaultRequestProcessor is RemoteStorage, AbstractRequestProcessor{

    /*
    * @dev process cross-chain message from Bridge's Adapter
    * @param _origin origin chain id
    * @param _sender sender address on origin chain
    * @param _message arbitrary message received from origin chain
    */
    function processRequest(
        uint256 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external override nonReentrant onlyHyperlaneAdapter(s.hyperlaneAdapter){
        isValidSender(_origin, _sender);
        // decode the message
        uint256 rootChain;
        address rootSender;
        Token[] memory tokens;
        address target;
        bytes memory message;

        (
            rootChain,
            rootSender,
            tokens,
            target,
            message
        ) = decodeMessage(_message);

        emit MessageProcessed(rootChain, rootSender, tokens, block.chainid, target);
        // ask the reserve manager to unlock / mint to token to the target
        sendTokens(tokens, target);

        // deliver the message to the target contract
        if(target.code.length > 0){
            IMessageReceiver(target).onMessageReceive(
                rootChain,
                rootSender,
                tokens,
                message
            );
        }
    }

    function decodeMessage(bytes memory _message) internal pure returns(uint256 root, address rootSender, Token[] memory tokens, address target, bytes memory message){
        // decode the message
        (root, rootSender, tokens, target, message) = abi.decode(_message, (uint256, address, Token[], address, bytes));
    }

    function isValidSender(uint256 _origin, bytes32 _sender) internal virtual view override{
        if(_origin == s.khalaniChainId && s.khalaniReceiver != TypeCasts.bytes32ToAddress(_sender)){
            revert InvalidSender(_sender);
        }
    }

    function sendTokens(Token[] memory tokens, address to) internal {
        IAssetReserves(s.assetReserves).mintOrUnlock(
            to,
            tokens
        );
    }
}