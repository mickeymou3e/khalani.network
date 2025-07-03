// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "./balancer/InputHelpers.sol";
import "./balancer/math/FixedPoint.sol";

import {LiquidationErrors} from './LiquidationErrors.sol';

import {ILinearPool} from "./balancer/ILinearPool.sol";
import {IWeightedPool} from "./balancer/IWeightedPool.sol";
import {IComposableStablePool} from "./balancer/IComposableStablePool.sol";
import {StableMath} from "./balancer/math/StableMath.sol";
import {WeightedMath} from "./balancer/math/WeightedMath.sol";
import {IAsset} from "./balancer/IAsset.sol";
import {IBasePool} from "./balancer/IBasePool.sol";
import {IVault} from "./balancer/IVault.sol";
import {ILendingPool} from "./lending/ILendingPool.sol";
import {ILiquidation} from "./ILiquidation.sol";

contract Liquidation is ILiquidation, Ownable {
    IVault public _vault;
    ILendingPool public _lendingPool;
    IBasePool public _triCryptoPool;
    IERC20[] public _triCryptoPoolTokens;
    bytes32 public _triCryptoPoolId;
    // Ckb tokens order 0. Linear CKB, 1. CKB
    address[] public _ckbPools;
    // Eth tokens order 0. Linear ETH, 1. ETH
    address[] public _ethPools;
    // USD tokens order 0. Boosted USD, 1. Linear USDC, 2 Linear USDT, 3 USDC, 4. USDT
    address[] public _usdPools;
    // PoolIds 0. Linear ckb, 1. Linear Eth, 2. Boosted USD, 3. linear USDC, 4. linear USDT
    bytes32[] public _poolIds;
    /**
     *
     * @param vault vault address
     * @param triCryptoAddress  address for TriCrypto pool
     * @param ckbPools Ckb tokens order 0. Linear CKB, 1. CKB
     * @param ethPools Eth tokens order 0. Linear ETH, 1. ETH
     * @param usdPools USD tokens order 0. Boosted USD, 1. Linear USDC, 2 Linear USDT, 3 USDC, 4. USDT
     */
    constructor(
        IVault vault,
        ILendingPool lendingPool,
        address triCryptoAddress,
        address[] memory ckbPools,
        address[] memory ethPools,
        address[] memory usdPools
    ) {
        _vault = vault;
        _lendingPool = lendingPool;
        _triCryptoPool = IBasePool(triCryptoAddress);
        _triCryptoPoolId = _triCryptoPool.getPoolId();
        _ckbPools = ckbPools;
        _ethPools = ethPools;
        _usdPools = usdPools;

        _poolIds = new bytes32[](5);

        _poolIds[0] = (IBasePool(_ckbPools[0]).getPoolId());
        _poolIds[1] = (IBasePool(_ethPools[0]).getPoolId());
        _poolIds[2] = (IBasePool(_usdPools[0]).getPoolId());
        _poolIds[3] = (IBasePool(_usdPools[1]).getPoolId());
        _poolIds[4] = (IBasePool(_usdPools[2]).getPoolId());

        (IERC20[] memory tokens, , ) = vault.getPoolTokens(_triCryptoPoolId);

        _triCryptoPoolTokens = tokens;
    }

    function getTriCryptoPoolTokens() public view returns (IERC20[] memory) {
        return _triCryptoPoolTokens;
    }

    function getAllPools()
        public
        view
        returns (
            address[] memory ckbPools,
            address[] memory ethPools,
            address[] memory usdPools
        )
    {
        return (_ckbPools, _ethPools, _usdPools);
    }

    function liquidate(
        address debtToken,
        address collateralToken,
        address user,
        uint256 repayAmount
    ) external override returns (uint256) {
        uint256 bptAmountIn = _calculateTokensFromRepayAmount(
            debtToken,
            repayAmount
        );
        require(
            bptAmountIn <= IERC20(address(_triCryptoPool)).balanceOf(
            address(this)
        ),
            LiquidationErrors.NOT_ENOUGHT_BALANCE_IN_BACKSTOP
        );

        _withdrawFromTriCryptoToBoosted(bptAmountIn, debtToken);

        _swapBoostedTokenToUnderyling(debtToken);

        uint256 currentDebtTokens = IERC20(debtToken).balanceOf(address(this));

        require(currentDebtTokens >= repayAmount, string(abi.encodePacked(LiquidationErrors.NOT_ENOUGHT_DEBT_TOKENS, ": ", toString(currentDebtTokens))));

        IERC20(debtToken).approve(address(_lendingPool), repayAmount);

        _lendingPool.liquidationCall(
            collateralToken,
            debtToken,
            user,
            repayAmount,
            false
        );

        if (IERC20(debtToken).balanceOf(address(this)) > 0) {
            _swapUnderylingTokenToBoostedToken(
                debtToken,
                _getBoostedTokenFromUnderyling(debtToken)
            );

            _depositFromBoostedTokenToTriCrypto(
                IERC20(_getBoostedTokenFromUnderyling(debtToken)).balanceOf(
                    address(this)
                ),
                debtToken
            );
        }

        if(debtToken != collateralToken) {
            _swapUnderylingTokenToBoostedToken(
                collateralToken,
                _getBoostedTokenFromUnderyling(collateralToken)
            );

            _depositFromBoostedTokenToTriCrypto(
                IERC20(_getBoostedTokenFromUnderyling(collateralToken)).balanceOf(address(this)),
                collateralToken
            );
        }


        IERC20(address(_triCryptoPool)).transfer(
            msg.sender,
            IERC20(address(_triCryptoPool)).balanceOf(address(this))
        );

        return 0;
    }

    function getLinearPoolWrappedToken(IERC20[] memory linearPoolTokens, address underyling, address linearToken) private pure returns ( IERC20) {
        for(uint256 i = 0; i < linearPoolTokens.length; ++i ) {
            if(address(linearPoolTokens[i]) != underyling && address(linearPoolTokens[i]) != linearToken) {
                return linearPoolTokens[i];
            }
        }

        revert(LiquidationErrors.WRONG_ADDRESS_FOR_WRAPPED_TOKENS);
    }



    function _calculateTokensFromRepayAmount(
        address debtToken,
        uint256 repayAmount
    ) private view returns (uint256) {
        /// Calculate how much Lp tokens we need to have to get underyling
            address token = _getLinearTokenFromUnderyling(debtToken);

            (IERC20[] memory linearPoolTokens, uint256[] memory linearPoolBalances, ) = _vault.getPoolTokens(
                _getUnderylingTokenPoolId(debtToken)
            );

   
            (uint256 linearAmpParameter, , ) = IComposableStablePool(token).getAmplificationParameter();

            uint256 [] memory  tokensWithoutBpt = _dropBptItem(
                    linearPoolBalances,
                    IComposableStablePool(token).getBptIndex()
            );


            uint256[] memory linearAmountsIn = new uint256[](tokensWithoutBpt.length);

                linearAmountsIn[
                    skipBptIndex(
                        _getAddressIndex(linearPoolTokens, token),
                        IComposableStablePool(_usdPools[0]).getBptIndex()
                    )
                ] = repayAmount;



            uint256 amount = StableMath._calcBptOutGivenExactTokensIn(
                linearAmpParameter,
                _dropBptItem(
                        linearPoolBalances,
                        IComposableStablePool(token).getBptIndex()
                ),
                linearAmountsIn,
                _getVirtualSupply(
                    IComposableStablePool(token).totalSupply(),
                    linearPoolBalances[
                        IComposableStablePool(token).getBptIndex()
                    ]
                ),
                StableMath._calculateInvariant(
                    linearAmpParameter,
                    _dropBptItem(
                        linearPoolBalances,
                        IComposableStablePool(token).getBptIndex()
                    )
                ),
                IComposableStablePool(token).getSwapFeePercentage()
            );

        
        /// If it is boosted path token we need to calculate how much boosted token we need to have to get the Linear one
            if (debtToken == _usdPools[3] || debtToken == _usdPools[4]) {
                (
                    IERC20[] memory tokens,
                    uint256[] memory boostedPoolBalances,

                ) = _vault.getPoolTokens(_poolIds[2]);

                (uint256 ampParameter, , ) = IComposableStablePool(_usdPools[0])
                    .getAmplificationParameter();

                uint256[] memory boostedPoolBalancesWithoutBptToken = _dropBptItem(
                    boostedPoolBalances,
                    IComposableStablePool(_usdPools[0]).getBptIndex()
                );

                uint256[] memory amountsIn = new uint256[](
                    boostedPoolBalancesWithoutBptToken.length
                );

                amountsIn[
                    skipBptIndex(
                        _getAddressIndex(tokens, token),
                        IComposableStablePool(_usdPools[0]).getBptIndex()
                    )
                ] = amount;

                amount = StableMath._calcBptOutGivenExactTokensIn(
                    ampParameter,
                    boostedPoolBalancesWithoutBptToken,
                    amountsIn,
                    _getVirtualSupply(
                        IComposableStablePool(_usdPools[0]).totalSupply(),
                        boostedPoolBalances[
                            IComposableStablePool(_usdPools[0]).getBptIndex()
                        ]
                    ),
                    StableMath._calculateInvariant(
                        ampParameter,
                        boostedPoolBalancesWithoutBptToken
                    ),
                    IComposableStablePool(_usdPools[0]).getSwapFeePercentage()
                );

                token = _usdPools[0];
            }
        ///

        /// Calculate how much 3Crypto tokens is needed to repay the debt
            (
                IERC20[] memory triCryptoTokens,
                uint256[] memory triCryptoBalances,

            ) = _vault.getPoolTokens(_triCryptoPoolId);

            uint256[] memory weightedPoolAmountsIn = new uint256[](
                triCryptoBalances.length
            );

            weightedPoolAmountsIn[
                _getAddressIndex(triCryptoTokens, token)
            ] = amount;


            return WeightedMath._calcBptOutGivenExactTokensIn(
                triCryptoBalances,
                IWeightedPool(address(_triCryptoPool)).getNormalizedWeights(),
                weightedPoolAmountsIn,
                IWeightedPool(address(_triCryptoPool)).totalSupply(),
                IWeightedPool(address(_triCryptoPool)).getSwapFeePercentage()
            ) * 1100 / 1000; // for not it is 10%
    }

    function _getVirtualSupply(
        uint256 totalSupply,
        uint256 bptBalance
    ) private pure returns (uint256) {
        return totalSupply - bptBalance;
    }

    /**
     * @dev Remove the item at `_bptIndex` from an arbitrary array (e.g., amountsIn).
     */
    function _dropBptItem(
        uint256[] memory amounts,
        uint256 bptIndex
    ) private pure returns (uint256[] memory) {
        uint256[] memory amountsWithoutBpt = new uint256[](amounts.length - 1);
        for (uint256 i = 0; i < amountsWithoutBpt.length; i++) {
            amountsWithoutBpt[i] = amounts[i < bptIndex ? i : i + 1];
        }

        return amountsWithoutBpt;
    }

    function _depositFromBoostedTokenToTriCrypto(
        uint256 amount,
        address underylingToken
    ) private {
        uint256 joinTokenIndex = _getAddressIndex(
            _triCryptoPoolTokens,
            _getBoostedTokenFromUnderyling(underylingToken)
        );

        uint256[] memory joinValues = new uint256[](
            _triCryptoPoolTokens.length
        );

        for (uint256 i = 0; i < _triCryptoPoolTokens.length; i++) {
            if (i == joinTokenIndex) {
                joinValues[i] = amount;
            }
        }

        uint256[] memory maximumValues = new uint256[](
            _triCryptoPoolTokens.length
        );

        for (uint256 i = 0; i < joinValues.length; i++) {
            if (i == joinTokenIndex) {
                maximumValues[i] = type(uint256).max;
            }
        }

        IVault.JoinPoolRequest memory joinPoolRequest = IVault.JoinPoolRequest(
            _mapTokensToAddresses(
                _triCryptoPoolTokens
            ),
            maximumValues,
            encodeJoinPoolUserData(1, joinValues, 0),
            false
        );

        _vault.joinPool(
            _triCryptoPoolId,
            address(this),
            address(this),
            joinPoolRequest
        );
    }


    function _withdrawFromTriCryptoToBoosted(
        uint256 amount,
        address underylingToken
    ) private {
        address lpToken = _getBoostedTokenFromUnderyling(underylingToken);
        uint256 exitTokenIndex = _getAddressIndex(
            _triCryptoPoolTokens,
            lpToken
        );

        bytes memory userData = encodeExitPoolUserData(
            0,
            amount,
            exitTokenIndex
        );

        IAsset[] memory tokenAddresses = _mapTokensToAddresses(
            _triCryptoPoolTokens
        );

        uint256[] memory minimalValues = new uint256[](tokenAddresses.length);

        for (uint256 i = 0; i < tokenAddresses.length; ++i) {
            minimalValues[i] = 0;
        }

        IVault.ExitPoolRequest memory exitPoolRequest = IVault.ExitPoolRequest(
            tokenAddresses,
            minimalValues,
            userData,
            false
        );

        IERC20(address(_triCryptoPool)).approve(address(_vault), amount);

        _vault.exitPool(
            _triCryptoPoolId,
            address(this),
            payable(address(this)),
            exitPoolRequest
        );
    }

    function _swapUnderylingTokenToBoostedToken(
        address underylingToken,
        address boostedToken
    ) private returns (int256[] memory) {
        uint256 underylingTokenBalance = IERC20(underylingToken).balanceOf(
            address(this)
        );

        IERC20(underylingToken).approve(
            address(_vault),
            underylingTokenBalance
        );

        (
            IVault.BatchSwapStep[] memory steps,
            IVault.FundManagement memory fundManagement,
            IAsset[] memory assets,
            int256[] memory limits
        ) = _getUnderylingTokenToBoostedTokenSwapData(
                underylingToken,
                boostedToken,
                underylingTokenBalance
            );

        return
            _vault.batchSwap(
                IVault.SwapKind.GIVEN_IN,
                steps,
                assets,
                fundManagement,
                limits,
                type(uint256).max
            );
    }

    function _swapBoostedTokenToUnderyling(
        address underylingToken
    ) private returns (int256[] memory) {
        address boostedToken = _getBoostedTokenFromUnderyling(underylingToken);

        uint256 boostedTokenBalance = IERC20(boostedToken).balanceOf(
            address(this)
        );

        (
            IVault.BatchSwapStep[] memory steps,
            IVault.FundManagement memory fundManagement,
            IAsset[] memory assets,
            int256[] memory limits
        ) = _getBoostedTokenToUnderylingSwapData(
                boostedToken,
                underylingToken,
                boostedTokenBalance
            );

        return
            _vault.batchSwap(
                IVault.SwapKind.GIVEN_IN,
                steps,
                assets,
                fundManagement,
                limits,
                type(uint256).max
            );
    }

    function _getUnderylingTokenToBoostedTokenSwapData(
        address underylingToken,
        address boostedToken,
        uint256 amount
    )
        private
        view
        returns (
            IVault.BatchSwapStep[] memory,
            IVault.FundManagement memory fundManagement,
            IAsset[] memory assets,
            int256[] memory limits
        )
    {
        IAsset[] memory tokenAddresses;
        int256[] memory swapLimits;
        IVault.FundManagement memory funds = getFundManagement(address(this));
        IVault.BatchSwapStep[] memory steps;
        // eth -> linear eth
        if (underylingToken == _ethPools[1]) {
            swapLimits = new int256[](2);
            tokenAddresses = new IAsset[](2);
            steps = new IVault.BatchSwapStep[](1);
            tokenAddresses[0] = IAsset(_ethPools[1]);
            tokenAddresses[1] = IAsset(_ethPools[0]);

            swapLimits[0] = int256(amount);
            swapLimits[1] = 0;
            steps[0] = IVault.BatchSwapStep(_poolIds[1], 0, 1, amount, "0x");
        }
        // ckb -> linear ckb
        else if (underylingToken == _ckbPools[1]) {
            swapLimits = new int256[](2);
            tokenAddresses = new IAsset[](2);
            steps = new IVault.BatchSwapStep[](1);

            swapLimits[0] = int256(amount);
            swapLimits[1] = 0;

            tokenAddresses[0] = IAsset(_ckbPools[1]);
            tokenAddresses[1] = IAsset(_ckbPools[0]);
            steps[0] = IVault.BatchSwapStep(_poolIds[0], 0, 1, amount, "0x");
        } else if (underylingToken == _usdPools[3]) {
            // usdc -> linear usdc -> hadouken boosted
            if (boostedToken == _usdPools[0]) {
                swapLimits = new int256[](3);
                tokenAddresses = new IAsset[](3);
                steps = new IVault.BatchSwapStep[](2);

                swapLimits[0] = int256(amount);
                swapLimits[1] = 0;
                swapLimits[2] = 0;

                tokenAddresses[0] = IAsset(_usdPools[3]);
                tokenAddresses[1] = IAsset(_usdPools[1]);
                tokenAddresses[2] = IAsset(_usdPools[0]);

                steps[0] = IVault.BatchSwapStep(
                    _poolIds[3],
                    0,
                    1,
                    amount,
                    "0x"
                );

                steps[1] = IVault.BatchSwapStep(_poolIds[2], 1, 2, 0, "0x");
            }
        } else if (underylingToken == _usdPools[4]) {
            // usdt -> linear usdt -> hadouken boosted
            if (boostedToken == _usdPools[0]) {
                swapLimits = new int256[](3);
                tokenAddresses = new IAsset[](3);
                steps = new IVault.BatchSwapStep[](2);

                swapLimits[0] = int256(amount);
                swapLimits[1] = 0;
                swapLimits[2] = 0;

                tokenAddresses[0] = IAsset(_usdPools[4]);
                tokenAddresses[1] = IAsset(_usdPools[2]);
                tokenAddresses[2] = IAsset(_usdPools[0]);

                steps[0] = IVault.BatchSwapStep(
                    _poolIds[4],
                    0,
                    1,
                    amount,
                    "0x"
                );
                steps[1] = IVault.BatchSwapStep(_poolIds[2], 1, 2, 0, "0x");
            }
        }

        require(steps.length > 0, LiquidationErrors.NO_STEPS);

        return (steps, funds, tokenAddresses, swapLimits);
    }

    function _getBoostedTokenToUnderylingSwapData(
        address boostedToken,
        address underylingToken,
        uint256 amount
    )
        private
        view
        returns (
            IVault.BatchSwapStep[] memory,
            IVault.FundManagement memory fundManagement,
            IAsset[] memory assets,
            int256[] memory swapLimits
        )
    {
        IVault.FundManagement memory funds = getFundManagement(address(this));
        IVault.BatchSwapStep[] memory steps;
        IAsset[] memory tokenAddresses;
        // linear eth -> eth
        if (boostedToken == _ethPools[0]) {
            swapLimits = new int256[](2);
            tokenAddresses = new IAsset[](2);
            steps = new IVault.BatchSwapStep[](1);

            swapLimits[0] = int256(amount);
            swapLimits[1] = 0;
            tokenAddresses[0] = IAsset(_ethPools[0]);
            tokenAddresses[1] = IAsset(_ethPools[1]);
            steps[0] = IVault.BatchSwapStep(_poolIds[1], 0, 1, amount, "0x");
        }
        // linear ckb -> ckb
        else if (boostedToken == _ckbPools[0]) {
            swapLimits = new int256[](2);
            tokenAddresses = new IAsset[](2);
            steps = new IVault.BatchSwapStep[](1);
            swapLimits[0] = int256(amount);
            swapLimits[1] = 0;
            tokenAddresses[0] = IAsset(_ckbPools[0]);
            tokenAddresses[1] = IAsset(_ckbPools[1]);
            steps[0] = IVault.BatchSwapStep(_poolIds[0], 0, 1, amount, "0x");
        } 
        else if (boostedToken == _usdPools[0]) {
            // hadouken boosted -> linear usdc -> usdc
            if (underylingToken == _usdPools[3]) {
                swapLimits = new int256[](3);
                tokenAddresses = new IAsset[](3);
                steps = new IVault.BatchSwapStep[](2);
                swapLimits[0] = int256(amount);
                swapLimits[1] = 0;
                swapLimits[2] = 0;

                tokenAddresses[0] = IAsset(_usdPools[0]);
                tokenAddresses[1] = IAsset(_usdPools[1]);
                tokenAddresses[2] = IAsset(_usdPools[3]);

                steps[0] = IVault.BatchSwapStep(
                    _poolIds[2],
                    0,
                    1,
                    amount,
                    "0x"
                );
                steps[1] = IVault.BatchSwapStep(_poolIds[3], 1, 2, 0, "0x");
            }
            // hadouken boosted -> linear usdt -> usdt
            else if (underylingToken == _usdPools[4]) {
                swapLimits = new int256[](3);
                tokenAddresses = new IAsset[](3);
                steps = new IVault.BatchSwapStep[](2);
                swapLimits[0] = int256(amount);
                swapLimits[1] = 0;
                swapLimits[2] = 0;
                tokenAddresses[0] = IAsset(_usdPools[0]);
                tokenAddresses[1] = IAsset(_usdPools[2]);
                tokenAddresses[2] = IAsset(_usdPools[4]);

                steps[0] = IVault.BatchSwapStep(
                    _poolIds[2],
                    0,
                    1,
                    amount,
                    "0x"
                );
                steps[1] = IVault.BatchSwapStep(_poolIds[4], 1, 2, 0, "0x");
            }
        }

        return (steps, funds, tokenAddresses, swapLimits);
    }

    function _getBoostedTokenFromUnderyling(
        address underylingToken
    ) private view returns (address) {
        if (_ckbPools[1] == underylingToken) {
            return _ckbPools[0];
        } else if (_ethPools[1] == underylingToken) {
            return _ethPools[0];
        } else if (
            _usdPools[3] == underylingToken || _usdPools[4] == underylingToken
        ) {
            return _usdPools[0];
        }

 
        revert(LiquidationErrors.WRONG_CONFIGURATION_OR_UNDERYLING_TOKEN);
    }

    function _getLinearTokenFromUnderyling(
        address underylingToken
    ) private view returns (address) {
        if (_ckbPools[1] == underylingToken) {
            return _ckbPools[0];
        } else if (_ethPools[1] == underylingToken) {
            return _ethPools[0];
        } else if (_usdPools[3] == underylingToken) {
            return _usdPools[1];
        } else if (_usdPools[4] == underylingToken) {
            return _usdPools[2];
        }

      revert(LiquidationErrors.WRONG_UNDERYLING_TOKEN_TO_LINEAR_TOKEN);
    }

    function _getUnderylingTokenPoolId(
        address underylingToken
    ) private view returns (bytes32) {
        if (_ckbPools[1] == underylingToken) {
            return _poolIds[0];
        } else if (_ethPools[1] == underylingToken) {
            return _poolIds[1];
        } else if (_usdPools[3] == underylingToken) {
            return _poolIds[3];
        } else if (_usdPools[4] == underylingToken) {
            return _poolIds[4];
        }

      revert(LiquidationErrors.WRONG_UNDERYLING_TOKEN_TO_POOL_ID);
    }

    function _getAddressIndex(
        IERC20[] memory poolTokens,
        address tokenAddress
    ) private pure returns (uint256) {
        for (uint256 i = 0; i < poolTokens.length; i++) {
            if (address(poolTokens[i]) == tokenAddress) {
                return i;
            }
        }

        revert(LiquidationErrors.ADDRESS_NOT_FOUND);
    }

    function _mapTokensToAddresses(
        IERC20[] memory tokens
    ) private pure returns (IAsset[] memory) {
        IAsset[] memory addresses = new IAsset[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            addresses[i] = IAsset(address(tokens[i]));
        }
        return addresses;
    }

    // Helper function to convert uint256 to string
    function toString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function getFundManagement(address _address) private pure returns (IVault.FundManagement memory)
    {
        return IVault.FundManagement(
            _address,
            false,
            payable(_address),
            false
        );
    }

    function encodeJoinPoolUserData(
        uint256 stablePoolJoinKind,
        uint256[] memory amounts,
        uint256 minimumBpt
    ) private pure returns (bytes memory) {
        return abi.encode(stablePoolJoinKind, amounts, minimumBpt);
    }

    function encodeExitPoolUserData(
        uint256 kind,
        uint256 amount,
        uint256 tokenIndex
    ) private pure returns (bytes memory) {
        return abi.encode(kind, amount, tokenIndex);
    }

    // Convert from an index into an array including BPT (the Vault's registered token list), to an index
    // into an array excluding BPT (usually from user input, such as amountsIn/Out).
    // `index` must not be the BPT token index itself.
    function skipBptIndex(
        uint256 index,
        uint256 bptIndex
    ) private pure returns (uint256) {
        // Currently this is never called with an index passed in from user input, so this check
        // should not be necessary. Included for completion (and future proofing).
        _require(index != bptIndex, Errors.OUT_OF_BOUNDS);

        return index < bptIndex ? index : index - 1;
    }

        /**
     * @dev Applies `scalingFactor` to `amount`, resulting in a larger or equal value depending on whether it needed
     * scaling or not.
     */
    function _upscale(uint256 amount, uint256 scalingFactor) internal pure returns (uint256) {
        // Upscale rounding wouldn't necessarily always go in the same direction: in a swap for example the balance of
        // token in should be rounded up, and that of token out rounded down. This is the only place where we round in
        // the same direction for all amounts, as the impact of this rounding is expected to be minimal (and there's no
        // rounding error unless `_scalingFactor()` is overriden).
        return FixedPoint.mulDown(amount, scalingFactor);
    }

        /**
     * @dev Same as `_upscale`, but for an entire array. This function does not return anything, but instead *mutates*
     * the `amounts` array.
     */
    function _upscaleArray(uint256[] memory amounts, uint256[] memory scalingFactors) internal pure {
        uint256 length = amounts.length;
        InputHelpers.ensureInputLengthMatch(length, scalingFactors.length);

        for (uint256 i = 0; i < length; ++i) {
            amounts[i] = FixedPoint.mulDown(amounts[i], scalingFactors[i]);
        }
    }

    //  function _scalingFactors() internal view virtual override returns (uint256[] memory) {
    //     uint256[] memory scalingFactors = new uint256[](_TOTAL_TOKENS);

    //     // The wrapped token's scaling factor is not constant, but increases over time as the wrapped token increases in
    //     // value.
    //     scalingFactors[_mainIndex] = _scalingFactorMainToken;
    //     scalingFactors[_wrappedIndex] = _scalingFactorWrappedToken.mulDown(_getWrappedTokenRate());
    //     scalingFactors[_bptIndex] = FixedPoint.ONE;

    //     return scalingFactors;
    // }

}
