pragma solidity ^0.8.0;

import "../InterchainMessaging/Errors.sol";
import "../Tokens/IERC20MintableBurnable.sol";

library LibScaling {
    uint256 internal constant ONE = 1e18;
    uint256 internal constant MAX_SUPPORTED_DECIMAL = 18;
    function _computeScalingFactor(address token, uint256 amount) internal view returns (uint256) {

        // Tokens that don't implement the `decimals` method are not supported.
        uint256 tokenDecimals = IERC20MintableBurnable(address(token)).decimals();

        // Tokens with more than 18 decimals are not supported.
        uint256 decimalsDifference = MAX_SUPPORTED_DECIMAL - tokenDecimals;
        if(decimalsDifference > MAX_SUPPORTED_DECIMAL){
            revert UnsupportedDecimals();
        }
        uint256 scalingFactor = ONE * 10**decimalsDifference;
        if(scalingFactor!=ONE){
            amount = _upscale(amount, scalingFactor);
        }
        return amount;
    }

    function _upscale(uint a, uint b) internal pure returns (uint){

        uint256 product = a * b;
        if(!(a == 0 || product / a == b)){
            revert MulOverflow();
        }

        return product / ONE;
    }
}
