pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../InterchainMessaging/Errors.sol";
import "../../../Tokens/IERC20MintableBurnable.sol";
import "../ILiquidityAggregator.sol";
import "../../LibScaling.sol";
import "../../../util/Owned.sol";

contract LiquidityAggregator is ILiquidityAggregator, Owned {

    mapping(address => address) public klnTokenMap;

    //------------EVENTS------------//

    event AssetRegistered(
        address mirrorToken,
        address klnToken
    );

    constructor() Owned(msg.sender){}

    /**
    * @dev Registers a mirror token and its corresponding kln token.
    * @param token The address of the mirror token.
    * @param klnToken The address of the kln token.
    */
    function registerTokenForKlnToken(address token, address klnToken) external onlyOwner {
        emit AssetRegistered(token,klnToken);
        klnTokenMap[token] = klnToken;
    }

    /**
    * @dev Deposits mirror tokens to the liquidity aggregator and redeem kln(Token) 1:1 mint.
    * @param token The struct containing the mirror token address and amount.
    * @param receiver The address to receive the kln(Token).
    * @return The struct containing the updated mirror token address and amount.
    */
    function deposit(
        Token memory token,
        address receiver
    ) external override returns (Token memory) {
        if(klnTokenMap[token.tokenAddress] == address (0x0)){
            revert AssetNotSupported(token.tokenAddress);
        }
        emit Deposit(msg.sender, receiver, token);
        SafeERC20.safeTransferFrom(IERC20(token.tokenAddress),msg.sender,address(this),token.amount);
        token.amount = LibScaling._computeScalingFactor(token.tokenAddress, token.amount);
        // change token to corresponding mirror token
        token.tokenAddress = klnTokenMap[token.tokenAddress];
        IERC20MintableBurnable(token.tokenAddress).mint(receiver,token.amount);
        return token;
    }
}