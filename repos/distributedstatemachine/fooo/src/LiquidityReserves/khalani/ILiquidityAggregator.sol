pragma solidity ^0.8.0;

import "../../InterchainMessaging/Token.sol";

interface ILiquidityAggregator {

    //------EVENT------//
    event Deposit(
        address indexed sender,
        address receiver,
        Token token
    );

    /**
    *@dev deposit tokens to the liquidity aggregator and redeem corresponding aggregate token
    *@param token -> tokens address and amount to be deposited
    *@param receiver address to receive aggregate token
    */
    function deposit(
        Token memory token,
        address receiver
    ) external returns (Token memory);
}