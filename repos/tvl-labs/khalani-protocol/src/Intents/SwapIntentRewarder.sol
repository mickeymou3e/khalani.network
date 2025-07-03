pragma solidity ^0.8.4;

import "./interfaces/IRewarder.sol";
import "openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol";
import "./BaseRewarder.sol";
import "../LiquidityReserves/khalani/LiquidityProjectorV2.sol";

contract SwapIntentRewarder is BaseRewarder {

    error NotImplemented();

    function reward(uint32 chainId, address token, uint256 amount, address to) external {
        _checkRole(SETTLEMENT_REACTOR);
        LiquidityProjectorV2(rewardSource).mint(chainId, token, amount, to);
    }

    function reward(address, uint256, address) external virtual {
        revert NotImplemented();
    }
}