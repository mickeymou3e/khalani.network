pragma solidity ^0.8.0;

import "./AbstractRequestProcessor.sol";
import "../../libraries/LibAppStorage.sol";
import "../../interfaces/IMessageReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../LiquidityReserves/khalani/ILiquidityAggregator.sol";
import "../Bridge/BridgeFacet.sol";
import "../../../LiquidityReserves/LibBatchTokenOp.sol";

contract RemoteRequestProcessor is KhalaniStorage, AbstractRequestProcessor {
    /**
     * @dev process cross-chain message from Bridge's Adapter
     * @param _origin origin chain id
     * @param _sender sender address on origin chain
     * @param _message arbitrary message received from origin chain
     */
    function processRequest(
        uint256 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external override nonReentrant onlyHyperlaneAdapter(s.hyperlaneAdapter) {
        //validate
        isValidSender(_origin, _sender);
        // decode the message
        address user;
        uint256 destinationChainId;
        Token[] memory tokens;
        bytes memory interchainLiquidityHubPayload;
        bool withAggregateTokens;
        address target;
        bytes memory message;

        (
            user,
            destinationChainId,
            tokens,
            interchainLiquidityHubPayload,
            withAggregateTokens,
            target,
            message
        ) = _decodeMessage(_message);

        if (target == address(0x0)) {
            revert ZeroTargetAddress();
        }

        emit MessageProcessed(
            _origin,
            user,
            tokens,
            destinationChainId,
            target
        );

        tokens = _mintOrUnlockTokens(_origin, tokens, address(this));
        if (withAggregateTokens) {
            tokens = _depositToLiquidityAggregator(tokens, address(this));
        }
        if (interchainLiquidityHubPayload.length != 0) {
            Token[] memory tokenOut = _executeILHPayload(
                tokens,
                interchainLiquidityHubPayload
            );
            if (destinationChainId == block.chainid) {
                LibBatchTokenOp._transferTokens(tokenOut, target);
                if (target.code.length > 0) {
                    //if a contract
                    IMessageReceiver(target).onMessageReceive(
                        _origin,
                        user,
                        tokenOut,
                        message
                    );
                }
            } else {
                LibBatchTokenOp._approveTokens(tokenOut, s.liquidityProjector);
                uint256 gas = IAdapter(s.hyperlaneAdapter).quoteSend(
                    destinationChainId,
                    tokenOut.length
                );
                BridgeFacet(address(this)).send{value : gas}(
                    _origin,
                    user,
                    destinationChainId,
                    tokenOut,
                    target,
                    message
                );
            }
        } else {
            if (destinationChainId == block.chainid) {
                LibBatchTokenOp._transferTokens(tokens, target);
                if (target.code.length > 0) {
                    //if a contract
                    IMessageReceiver(target).onMessageReceive(
                        _origin,
                        user,
                        tokens,
                        message
                    );
                }
            }
        }
    }

    /**
     * @dev decode the message received from origin chain
     * @param _message arbitrary message received from origin chain
     */
    function _decodeMessage(
        bytes memory _message
    )
    internal
    pure
    returns (
        address user,
        uint256 destinationChainId,
        Token[] memory approvedTokens,
        bytes memory interchainLiquidityHubPayload,
        bool isSwapWithAggregateToken,
        address target,
        bytes memory message
    )
    {
        (
            user,
            destinationChainId,
            approvedTokens,
            interchainLiquidityHubPayload,
            isSwapWithAggregateToken,
            target,
            message
        ) = abi.decode(
            _message,
            (address, uint256, Token[], bytes, bool, address, bytes)
        );
    }

    /**
     * @dev exchange mirror tokens with kln(Token)
     * @param tokens array of tokens to approve
     * @param receiver address which will receive kln tokens
     */
    function _depositToLiquidityAggregator(
    //transfer case
        Token[] memory tokens,
        address receiver
    ) private returns (Token[] memory) {
        address kai = address(ILiquidityProjector(s.liquidityProjector).kai());
        for (uint i; i < tokens.length; ) {
            if (tokens[i].tokenAddress == kai) {
                IERC20(kai).transfer(receiver, tokens[i].amount);
                unchecked {
                    ++i;
                }
                continue;
            }
            SafeERC20.forceApprove(
                IERC20(tokens[i].tokenAddress),
                s.liquidityAggregator,
                tokens[i].amount
            );
            tokens[i] = ILiquidityAggregator(s.liquidityAggregator).deposit(
                tokens[i],
                receiver
            );
            unchecked {
                ++i;
            }
        }
        return tokens;
    }

    function isValidSender(
        uint256 _origin,
        bytes32 _sender
    ) internal view virtual override {
        if (
            s.chainIdToAdapter[_origin] != TypeCasts.bytes32ToAddress(_sender)
        ) {
            revert InvalidSender(_sender);
        }
    }

    function _executeILHPayload(
        Token[] memory tokens,
        bytes memory interchainLiquidityHubPayload
    ) private returns (Token[] memory outTokens) {
        // approveTokens to swap executor
        LibBatchTokenOp._approveTokens(tokens, s.interchainLiquidityHub);
        // call the executor
        (bool success, bytes memory returnData) = s.interchainLiquidityHub.call(
            interchainLiquidityHubPayload
        );
        if (!success) {
            revert ILHSwapFailed();
        }
        outTokens = abi.decode(returnData, (Token[]));
    }

    function _mintOrUnlockTokens(
        uint256 chainId,
        Token[] memory tokens,
        address to
    ) private returns (Token[] memory) {
        return
        ILiquidityProjector(s.liquidityProjector).mintOrUnlock(
            chainId,
            to,
            tokens
        );
    }
}
