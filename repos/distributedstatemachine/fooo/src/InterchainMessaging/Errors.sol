pragma solidity ^0.8.0;

//Nexus Errors
    error InvalidInbox();
    error InvalidNexus();
    error InvalidRouter();
    error InvalidHyperlaneAdapter();
    error NotValidOwner();
    error AssetNotFound(address token);
    error AssetNotWhiteListed(address token);
    error ZeroTargetAddress();
    error InvalidSender(bytes32 sender);
    error AssetNotSupported(address asset);
    error RedeemFailedNotEnoughBalance();
    error MulOverflow();
    error UnsupportedDecimals();
    error ILHSwapFailed();
    error BaseDiamondFacet__nonReentrant_reentrantCall();
    error BaseDiamondFacet__bridgeCallNonReentrant_reentrantCall();
    error InterchainLiquidityHubWrapper__NoSwapsToExecute();
    error InterchainLiquidityHubWrapper__NoAssetsToSwap();