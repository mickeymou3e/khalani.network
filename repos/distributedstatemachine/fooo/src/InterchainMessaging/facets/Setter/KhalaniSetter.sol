pragma solidity ^0.8.0;

import "../../libraries/LibAppStorage.sol";


// contract to set all variables in Khalani Interchain Messaging AppStorage
contract KhalaniSetter is KhalaniStorage {

    //---------------------EVENTS---------------------//
    event RemoteRequestProcessorInitialized(
        address hyperlaneAdapter,
        address liquidityProjector,
        address interchainLiquidityHub,
        address liquidityAggregator
    );

    event RemoteAdapterRegistered(
        uint256 originChainId,
        address adapter
    );

    //---------------------Khalani Chain---------------------//
    /**
    * @notice only to be added in Khalani chain diamond
    * @dev init variables in AppStorage
    * @param hyperlaneAdapter address of hyperlane adapter contract
    * @param liquidityProjector address of liquidity projector contract
    * @param interchainLiquidityHub address of interchainLiquidityHub contract
    * @param liquidityAggregator address of liquidity aggregator contract
    */
    function initializeRemoteRequestProcessor(
        address hyperlaneAdapter,
        address liquidityProjector,
        address interchainLiquidityHub,
        address liquidityAggregator
    ) external onlyDiamondOwner {
        emit RemoteRequestProcessorInitialized(
            hyperlaneAdapter,
            liquidityProjector,
            interchainLiquidityHub,
            liquidityAggregator
        );
        s.hyperlaneAdapter = hyperlaneAdapter;
        s.liquidityProjector = liquidityProjector;
        s.interchainLiquidityHub = interchainLiquidityHub;
        s.liquidityAggregator = liquidityAggregator;
    }

    /**
    * @notice only to be added in Khalani chain diamond
    * @dev init variables in AppStorage
    * @param chainId chain id of remote chain
    * @param adapter address of hyperlane adapter contract deployed on remote chain
    */
    function registerRemoteAdapter(
        uint256 chainId,
        address adapter
    ) external onlyDiamondOwner {
        emit RemoteAdapterRegistered(
            chainId,
            adapter
        );
        s.chainIdToAdapter[chainId] = adapter;
    }
}