// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "src/IMinimalBalancerV2.sol";
import "src/Math.sol";

import "./ERC20Mock.sol";

contract BalancerVaultV2Mock is IMinimalBalancerVaultV2 {
    using Math for uint256;

    uint256 constant MAX_IN_RATIO = 0.3e18;

    constructor() {}

    address private poolAddress;
    address private poolToken0Address;
    address private poolToken1Address;
    uint256 private poolToken0Balance;
    uint256 private poolToken1Balance;

    function setPoolAddress(address _poolAddress) public {
        poolAddress = _poolAddress;
    }

    function setPoolToken0Address(address _tokenAddress) public {
        poolToken0Address = _tokenAddress;
    }

    function setPoolToken1Address(address _tokenAddress) public {
        poolToken1Address = _tokenAddress;
    }

    function setPoolToken0Balance(uint256 _balance) public {
        poolToken0Balance = _balance;
    }

    function setPoolToken1Balance(uint256 _balance) public {
        poolToken1Balance = _balance;
    }

    function swap(SingleSwap memory singleSwap, FundManagement memory funds, uint256, uint256)
        external
        payable
        returns (uint256 amountCalculated)
    {
        uint256[] memory weights = IMinimalBalancerPoolV2(poolAddress).getNormalizedWeights();
        uint256 amountOut =
            _calcOutGivenIn(poolToken1Balance, weights[1], poolToken0Balance, weights[0], singleSwap.amount);
        if (poolToken0Address == address(singleSwap.assetIn)) {
            amountOut = _calcOutGivenIn(poolToken0Balance, weights[0], poolToken1Balance, weights[1], singleSwap.amount);
        }

        ERC20Mock(address(singleSwap.assetIn)).burn(funds.sender, singleSwap.amount);
        ERC20Mock(address(singleSwap.assetOut)).mint(funds.recipient, amountOut);

        return amountOut;
    }

    function getPoolTokens(bytes32)
        external
        view
        returns (IERC20[] memory tokens, uint256[] memory balances, uint256 lastChangeBlock)
    {
        IERC20[] memory _tokens = new IERC20[](2);
        _tokens[0] = IERC20(poolToken0Address);
        _tokens[1] = IERC20(poolToken1Address);

        uint256[] memory _balances = new uint256[](2);
        _balances[0] = poolToken0Balance;
        _balances[1] = poolToken1Balance;
        return (_tokens, _balances, 0);
    }

    function getPool(bytes32) external view returns (address, PoolSpecialization) {
        return (poolAddress, PoolSpecialization.GENERAL);
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
