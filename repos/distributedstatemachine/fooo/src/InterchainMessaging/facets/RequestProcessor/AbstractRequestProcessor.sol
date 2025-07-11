pragma solidity ^0.8.0;

import "../../libraries/LibAppStorage.sol";
import "../../interfaces/IRequestProcessorFacet.sol";
import "../../../LiquidityReserves/khalani/ILiquidityProjector.sol";
import "../../../LiquidityReserves/remote/IAssetReserves.sol";
import "../../Token.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

abstract contract AbstractRequestProcessor is IRequestProcessorFacet {

    //------------EVENTS------------//
    event MessageProcessed(
        uint256 indexed origin,
        address indexed sender,
        Token[] tokens,
        uint destination,
        address target
    );

    //------------FUNCTIONS------------//
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
    ) external virtual;

    /**
    * @param _origin origin chain id
    * @param _sender sender address on origin chain
    */
    function isValidSender(uint256 _origin, bytes32 _sender) internal virtual view;
}