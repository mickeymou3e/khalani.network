pragma solidity ^0.8.0;

import "../InterchainMessaging/Token.sol";
import "./khalani/ILiquidityProjector.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library LibBatchTokenOp {

    function _transferTokens(Token[] memory tokens, address to) internal {
        for(uint i; i<tokens.length;){
            SafeERC20.safeTransfer(
                IERC20(tokens[i].tokenAddress),
                to,
                tokens[i].amount
            );
            unchecked{
                ++i;
            }
        }
    }

    /**
    * @dev approve tokens to an address
    * @param tokens array of tokens to approve
    * @param to address to approve tokens to
    */
    function _approveTokens(Token[] memory tokens, address to) internal {
        for (uint i; i < tokens.length; ) {
            SafeERC20.forceApprove(
                IERC20(tokens[i].tokenAddress),
                to,
                tokens[i].amount
            );

            unchecked {
                ++i;
            }
        }
    }
}