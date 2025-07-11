// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IRebalancer.sol";
import "./Math.sol";

contract Rebalancer is IRebalancer {
    using Math for uint256;

    IMinimalBalancerVaultV2 public immutable override balancer;
    uint256 constant MAX_IN_RATIO = 0.3e18;

    constructor(address _balancerAddress) {
        require(_balancerAddress != address(0), "_balancerAddress cannot be zero");

        balancer = IMinimalBalancerVaultV2(_balancerAddress);

        emit RebalancerCreated(_balancerAddress);
    }

    /// @inheritdoc IRebalancer
    function rebalance(uint256 _targetRatio, bytes32 _poolId) external {
        IVault vault = IVault(msg.sender);

        // Get the amount of each asset in the vault
        uint256 amount0InVault = vault.token0().balanceOf(msg.sender);
        uint256 amount1InVault = vault.token1().balanceOf(msg.sender);

        // Calculate the total amount of each asset in the vault in terms of the other asset
        (, uint256 totalAmountIn0) = _calcTotalAmount(true, amount0InVault, amount1InVault, _poolId);
        (uint256 amount0In1, uint256 totalAmountIn1) = _calcTotalAmount(false, amount0InVault, amount1InVault, _poolId);

        uint256 currentRatio = amount0In1 * 100 / totalAmountIn1;

        if (currentRatio == _targetRatio) {
            return;
        }

        // Trade assets using Balancer v2
        FundManagement memory funds = FundManagement({
            sender: address(vault),
            fromInternalBalance: false,
            recipient: payable(address(vault)),
            toInternalBalance: false
        });

        SingleSwap memory singleSwap = SingleSwap({
            poolId: _poolId,
            kind: SwapKind.GIVEN_IN,
            assetIn: IAsset(address(vault.token1())),
            assetOut: IAsset(address(vault.token0())),
            amount: 0,
            userData: ""
        });

        if (currentRatio > _targetRatio) {
            // We need to swap some A for B
            uint256 amountToSwap = totalAmountIn0 * (currentRatio - _targetRatio) / 100;
            vault.token1().approve(address(balancer), amountToSwap);
            singleSwap.assetIn = IAsset(address(vault.token0()));
            singleSwap.assetOut = IAsset(address(vault.token1()));
            singleSwap.amount = amountToSwap;

            balancer.swap(singleSwap, funds, 0, block.timestamp);
        } else {
            // We need to swap some B for A
            uint256 amountToSwap = totalAmountIn1 * (_targetRatio - currentRatio) / 100;
            vault.token0().approve(address(balancer), amountToSwap);
            singleSwap.amount = amountToSwap;

            balancer.swap(singleSwap, funds, 0, block.timestamp);
        }

        emit Rebalance(msg.sender, _targetRatio, _poolId);
    }

    /// @inheritdoc IRebalancer
    function calcCurrentRatio(bytes32 _poolId) external view override returns (uint256) {
        IVault vault = IVault(msg.sender);

        uint256 amount0InVault = vault.token0().balanceOf(msg.sender);
        uint256 amount1InVault = vault.token1().balanceOf(msg.sender);
        (uint256 amount0In1, uint256 totalAmountIn1) = _calcTotalAmount(false, amount0InVault, amount1InVault, _poolId);

        return amount0In1 * 100 / totalAmountIn1;
    }

    function _calcTotalAmount(bool _in0, uint256 _amount0, uint256 _amount1, bytes32 _poolId)
        internal
        view
        returns (uint256, uint256)
    {
        (, uint256[] memory balances,) = balancer.getPoolTokens(_poolId);
        uint256 amount0InPool = balances[0];
        uint256 amount1InPool = balances[1];
        (address poolAddress,) = balancer.getPool(_poolId);
        uint256[] memory weights = IMinimalBalancerPoolV2(poolAddress).getNormalizedWeights();

        if (_in0) {
            uint256 amountOf1In0 = _calcOutGivenIn(amount1InPool, weights[1], amount0InPool, weights[0], _amount1);
            return (amountOf1In0, _amount0 + amountOf1In0);
        } else {
            uint256 amountOf0In1 = _calcOutGivenIn(amount0InPool, weights[0], amount1InPool, weights[1], _amount0);
            return (amountOf0In1, _amount1 + amountOf0In1);
        }
    }

    function _calcOutGivenIn(
        uint256 balanceIn,
        uint256 weightIn,
        uint256 balanceOut,
        uint256 weightOut,
        uint256 amountIn
    ) private pure returns (uint256) {
        /**
         *
         *     // outGivenIn                                                                                //
         *     // aO = amountOut                                                                            //
         *     // bO = balanceOut                                                                           //
         *     // bI = balanceIn              /      /            bI             \    (wI / wO) \           //
         *     // aI = amountIn    aO = bO * |  1 - | --------------------------  | ^            |          //
         *     // wI = weightIn               \      \       ( bI + aI )         /              /           //
         *     // wO = weightOut                                                                            //
         *
         */

        // Amount out, so we round down overall.

        // The multiplication rounds down, and the subtrahend (power) rounds up (so the base rounds up too).
        // Because bI / (bI + aI) <= 1, the exponent rounds down.

        // Cannot exceed maximum in ratio
        require(amountIn <= balanceIn.mulDown(MAX_IN_RATIO), "Exceed maximum in ratio");

        uint256 denominator = balanceIn + amountIn;
        uint256 base = balanceIn.divUp(denominator);
        uint256 exponent = weightIn.divDown(weightOut);
        uint256 power = base.powUp(exponent);

        return balanceOut.mulDown(power.complement());
    }
}
