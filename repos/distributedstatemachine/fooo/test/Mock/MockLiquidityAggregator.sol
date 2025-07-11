pragma solidity ^0.8.0;

import "../../src/LiquidityReserves/khalani/ILiquidityAggregator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../src/Tokens/IERC20MintableBurnable.sol";

contract MockLiquidityAggregator is ILiquidityAggregator {
    address klnToken;

    constructor(address _klnToken) {
        klnToken = _klnToken;
    }

    function deposit(Token memory token, address receiver) external returns (Token memory){
        //pull
        IERC20(token.tokenAddress).transferFrom(msg.sender, address(this), token.amount);
        //mint
        IERC20MintableBurnable(klnToken).mint(receiver, token.amount);
        return Token(klnToken,token.amount);
    }
}