pragma solidity ^0.8.0;

import "../../libraries/LibAppStorage.sol";
import "../../interfaces/IAdapter.sol";
import "../../../LiquidityReserves/remote/IAssetReserves.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import "../../Token.sol";

//End-chain Nexus Facet
contract RemoteBridgeFacet is RemoteStorage{

    //------------EVENTS------------//
    event RemoteBridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );
    //------------FUNCTIONS------------//
    /**
    * @dev send cross-chain message from Source to Khalani to Destination
    * @param destinationChainId destination chain id
    * @param approvedTokens array of tokens (address , amount) to be sent
    * @param interchainLiquidityHubPayload ILH pool swap payload
    * @param target target address on destination chain
    * @param message arbitrary message to be sent
    */
    function send(
        uint256 destinationChainId,
        Token[] memory approvedTokens,
        bytes calldata interchainLiquidityHubPayload,
        bool isSwapWithAggregateToken,
        address target,
        bytes calldata message
    ) external payable bridgeCallNonReentrant{
        if(target==address(0x0)){
            revert ZeroTargetAddress();
        }
        emit RemoteBridgeRequest(
            msg.sender,
            destinationChainId,
            approvedTokens,
            target
        );
        //burn kai / lock whitelisted tokens
        IAssetReserves(s.assetReserves).lockOrBurn(msg.sender, approvedTokens);
        //encode message into a payload for hyperlane adapter and send
        bytes32 messageId = IAdapter(s.hyperlaneAdapter).relayMessage(
            s.khalaniChainId,
            TypeCasts.addressToBytes32(s.khalaniReceiver),
            prepareOutgoingMessage(
                destinationChainId,
                approvedTokens,
                interchainLiquidityHubPayload,
                isSwapWithAggregateToken,
                target,
                message
            )
        );

        //pay for gas
        IAdapter(s.hyperlaneAdapter).payRelayer{value : msg.value}(
            messageId,
            destinationChainId,
            approvedTokens.length,
            msg.sender
        );
    }

    /**
    * @dev get the address of the liquidity projector
    */
    function getAssetReserves() external view returns(address){
        return s.assetReserves;
    }

    /**
    * @dev send cross-chain message from Source to Khalani to Destination
    * @param destinationChainId destination chain id
    * @param approvedTokens array of tokens (address , amount) to be sent
    * @param interchainLiquidityHubPayload ILH pool swap payload
    * @param target target address on destination chain
    * @param message arbitrary message to be sent
    */
    function prepareOutgoingMessage(
        uint256 destinationChainId,
        Token[] memory approvedTokens,
        bytes calldata interchainLiquidityHubPayload,
        bool isSwapWithAggregateToken,
        address target,
        bytes calldata message
    ) internal view returns (bytes memory){
        //encode message into a payload for hyperlane adapter and send
        return abi.encode(
            msg.sender,
            destinationChainId,
            approvedTokens,
            interchainLiquidityHubPayload,
            isSwapWithAggregateToken,
            target,
            message
        );
    }
}

