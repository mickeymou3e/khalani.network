pragma solidity ^0.8.0;

import "../../libraries/LibAppStorage.sol";
import "../../interfaces/IAdapter.sol";
import "../../../LiquidityReserves/khalani/ILiquidityProjector.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import "../../Token.sol";
//Khalani Nexus Facet
contract BridgeFacet is KhalaniStorage{
    //------------EVENTS------------//
    event BridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );
    //------------FUNCTIONS------------//
    /**
    * @dev send cross-chain message from Khalani to Destination
    * @param destinationChainId destination chain id
    * @param tokens array of tokens (address , amount) to be sent
    * @param target target address on destination chain
    * @param message arbitrary message to be sent
    */
    function send(
        uint256 rootChainId,
        address rootSender,
        uint256 destinationChainId,
        Token[] memory tokens,
        address target,
        bytes calldata message
    ) external payable bridgeCallNonReentrant {
        if(target==address(0x0)){
            revert ZeroTargetAddress();
        }
        emit BridgeRequest(
            msg.sender,
            destinationChainId,
            tokens,
            target
        );
        tokens = ILiquidityProjector(s.liquidityProjector).lockOrBurn(destinationChainId, msg.sender, tokens);

        bytes32 messageId = IAdapter(s.hyperlaneAdapter).relayMessage(
            destinationChainId,
            TypeCasts.addressToBytes32(s.chainIdToAdapter[destinationChainId]),
            prepareOutgoingMessage(
                rootChainId,
                rootSender,
                tokens,
                target,
                message
            )
        );

        IAdapter(s.hyperlaneAdapter).payRelayer{value : msg.value}(
            messageId,
            destinationChainId,
            tokens.length,
            msg.sender
        );
    }

    /**
    * @dev get the address of the liquidity projector
    */
    function getLiquidityProjector() external view returns(address){
        return s.liquidityProjector;
    }

    /**
    * @dev send cross-chain message from Khalani to Destination
    * @param tokens array of tokens (address , amount) to be sent
    * @param target target address on destination chain
    * @param message arbitrary message to be sent
    */
    function prepareOutgoingMessage(
        uint256 rootChainId,
        address rootSender,
        Token[] memory tokens,
        address target,
        bytes calldata message
    ) internal pure returns (bytes memory){
        return abi.encode(
            rootChainId,
            rootSender,
            tokens,
            target,
            message
        );
    }
}

