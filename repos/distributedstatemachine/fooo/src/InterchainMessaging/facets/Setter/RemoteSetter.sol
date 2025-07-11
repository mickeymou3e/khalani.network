pragma solidity ^0.8.0;

import "../../libraries/LibAppStorage.sol";

// contract to set all variables in Remote Interchain Messaging AppStorage
contract RemoteSetter is RemoteStorage {

    //---------------------EVENTS---------------------//
    event Initialized(
        address assetReserves,
        address khalaniReceiver,
        uint256 khalaniChainId,
        address hyperlaneAdapter
    );

    //---------------------Remote Chain---------------------//
    /**
    * @notice only to be added in Remote chain diamond
    * @dev init variables in AppStorage
    * @param assetReserves address of asset reserves contract
    * @param khalaniReceiver address of khalani receiver contract (adapter)
    * @param khalaniChainId chain id of khalani chain
    * @param hyperlaneAdapter address of hyperlane adapter contract
    */
    function initialize(
        address assetReserves,
        address khalaniReceiver,
        uint256 khalaniChainId,
        address hyperlaneAdapter
    ) external onlyDiamondOwner {
        emit Initialized(
            assetReserves,
            khalaniReceiver,
            khalaniChainId,
            hyperlaneAdapter
        );
        s.assetReserves = assetReserves;
        s.khalaniReceiver = khalaniReceiver;
        s.khalaniChainId = khalaniChainId;
        s.hyperlaneAdapter = hyperlaneAdapter;
    }
}