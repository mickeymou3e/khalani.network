pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import {IFlashLoanReceiver} from './interfaces/IFlashLoanReceiver.sol';
import {IYokaiRouter02} from './interfaces/IYokaiRouter02.sol';
import {ILendingPool} from './interfaces/ILendingPool.sol';
import {IVault} from './interfaces/IVault.sol';
import {IERC20} from './interfaces/IERC20.sol';
import {IAsset} from './interfaces/IAsset.sol';
import {IWETH} from './interfaces/IWETH.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'solidity-bytes-utils/contracts/BytesLib.sol';

contract ArbitrageSwap is IFlashLoanReceiver {
  using BytesLib for bytes;
  uint256 constant UINT256_MAX = type(uint256).max;
  ILendingPool private lendingPool;
  address private vaultAddress;
  IWETH private WCKB;
  IERC20 private pCKB;

  enum SwapOrder {
    HADOUKEN_FIRST,
    YOKAI_FIRST
  }

  struct ArbitrageParams {
    uint256 quoteAmount;
    address baseTokenAddress;
    address quoteTokenAddress;
    SwapOrder order;
    bytes batchSwapCalldata;
    address yokaiPoolAddress;
  }

  constructor(
    address _vaultAddress,
    address lendingPoolAddress,
    address pCKBAddress,
    address WCKBAddress
  ) public {
    vaultAddress = _vaultAddress;
    lendingPool = ILendingPool(lendingPoolAddress);
    pCKB = IERC20(pCKBAddress);
    WCKB = IWETH(WCKBAddress);
  }

  function arbitrage(ArbitrageParams memory arbitrageParams) external {
    address[] memory tokens = new address[](1);
    tokens[0] = arbitrageParams.quoteTokenAddress;

    uint256[] memory amounts = new uint256[](1);
    amounts[0] = arbitrageParams.quoteAmount;

    uint256[] memory modes = new uint256[](1);
    modes[0] = 0;

    bytes memory params = abi.encode(msg.sender, arbitrageParams);

    lendingPool.flashLoan(
      address(this),
      tokens,
      amounts,
      modes,
      address(this),
      params,
      0
    );
  }

  function swapYokai(
    IERC20 buyToken,
    IERC20 sellToken,
    uint256 amount,
    ArbitrageParams memory arbitrageParams
  ) private {
    address[] memory tokens = new address[](2);
    tokens[0] = address(sellToken);
    tokens[1] = address(buyToken);
    sellToken.approve(arbitrageParams.yokaiPoolAddress, amount);
    IYokaiRouter02 yokaiPool = IYokaiRouter02(arbitrageParams.yokaiPoolAddress);

    if (address(buyToken) == address(pCKB)) {
      tokens[1] = address(WCKB);
      yokaiPool.swapExactTokensForETH(
        amount,
        0,
        tokens,
        address(this),
        UINT256_MAX
      );
    } else if (address(sellToken) == address(pCKB)) {
      tokens[0] = address(WCKB);
      yokaiPool.swapExactETHForTokens{value: amount}(
        0,
        tokens,
        address(this),
        UINT256_MAX
      );
    } else {
      yokaiPool.swapExactTokensForTokens(
        amount,
        0,
        tokens,
        address(this),
        UINT256_MAX
      );
    }
  }

  function swapHadouken(
    bytes memory batchSwapCalldata,
    IERC20 sellToken
  ) private {
    sellToken.approve(vaultAddress, sellToken.balanceOf(address(this)));
    (bool success, bytes memory result) = vaultAddress.call(batchSwapCalldata);
    if (!success) {
      assembly {
        revert(add(result, 32), result)
      }
    }
  }

  function changeAmountInHadoukenCallData(
    bytes memory batchSwapCalldata,
    uint256 baseTokenBalance
  ) public pure returns (bytes memory) {
    uint8 kind;
    IVault.BatchSwapStep[] memory swaps;
    address[] memory assets;
    IVault.FundManagement memory funds;
    int256[] memory limits;
    uint256 deadline;

    bytes memory calldataNoSig = batchSwapCalldata.slice(
      4,
      batchSwapCalldata.length - 4
    );

    (kind, swaps, assets, funds, limits, deadline) = abi.decode(
      calldataNoSig,
      (
        uint8,
        IVault.BatchSwapStep[],
        address[],
        IVault.FundManagement,
        int256[],
        uint256
      )
    );

    uint256 totalIn = 0;
    for (uint i = 0; i < swaps.length; i++) {
      if (swaps[i].assetInIndex == 0) {
        totalIn += swaps[i].amount;
      }
    }

    if (totalIn > baseTokenBalance) {
      swaps[0].amount -= totalIn - baseTokenBalance;
    } else if (totalIn < baseTokenBalance) {
      swaps[0].amount += baseTokenBalance - totalIn;
    }

    return
      abi.encodeWithSignature(
        'batchSwap(uint8,(bytes32,uint256,uint256,uint256,bytes)[],address[],(address,bool,address,bool),int256[],uint256)',
        kind,
        swaps,
        assets,
        funds,
        limits,
        deadline
      );
  }

  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns (bool) {
    address originalSender;
    ArbitrageParams memory arbitrageParams;
    (originalSender, arbitrageParams) = abi.decode(
      params,
      (address, ArbitrageParams)
    );

    IERC20 baseToken = IERC20(arbitrageParams.baseTokenAddress);
    IERC20 quoteToken = IERC20(arbitrageParams.quoteTokenAddress);

    if (arbitrageParams.order == SwapOrder.HADOUKEN_FIRST) {
      uint256 baseTokenAmount = baseToken.balanceOf(address(this));
      swapHadouken(arbitrageParams.batchSwapCalldata, quoteToken);
      uint256 baseTokenDelta = baseToken.balanceOf(address(this)) -
        baseTokenAmount;
      swapYokai(quoteToken, baseToken, baseTokenDelta, arbitrageParams);
    } else if (arbitrageParams.order == SwapOrder.YOKAI_FIRST) {
      uint256 baseTokenAmount = baseToken.balanceOf(address(this));
      swapYokai(baseToken, quoteToken, amounts[0], arbitrageParams);
      uint256 baseTokenDelta = baseToken.balanceOf(address(this)) -
        baseTokenAmount;
      bytes memory batchSwapCallData = changeAmountInHadoukenCallData(
        arbitrageParams.batchSwapCalldata,
        baseTokenDelta
      );
      swapHadouken(batchSwapCallData, baseToken);
    }

    uint256 currentBalance = quoteToken.balanceOf(address(this));
    uint256 returnValue = amounts[0] + premiums[0];

    if (returnValue > currentBalance) {
      revert(
        string.concat(
          'Negative profit! ',
          Strings.toString(returnValue - currentBalance)
        )
      );
    } else if (returnValue < currentBalance) {
      quoteToken.transfer(originalSender, currentBalance - returnValue);
    }

    quoteToken.approve(address(lendingPool), returnValue);

    return true;
  }

  receive() external payable {}
}
