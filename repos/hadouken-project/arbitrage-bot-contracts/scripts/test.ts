import { BigNumber, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { FundManagement, SwapTypes } from '@hadouken-project/sdk'

import {
  IERC20__factory,
  ArbitrageSwap__factory,
  IVault__factory,
  IYokaiRouter02__factory,
} from '../typechain-types'

const MAINNET_RPC = 'https://v1.mainnet.godwoken.io/rpc'
const TESTNET_RPC = 'https://godwoken-testnet-v1.ckbapp.dev'

const MAINNET_CHAIN_ID = 71402
const TESTNET_CHAIN_ID = 71401

const USDC_MAINNET_ADDRESS = '0x186181e225dc1Ad85a4A94164232bD261e351C33'
const USDC_TESTNET_ADDRESS = '0x0c7F21908222098616803EfF5d054d3F4EF57EBb'

const USDT_MAINNET_ADDRESS = '0x8E019acb11C7d17c26D334901fA2ac41C1f44d50'
const USDT_TESTNET_ADDRESS = '0x30b0A247DE59a1CDF44329b756d3343E5afEd7f9'

const txOverrides = {
  gasLimit: 12_000_000,
}

async function main() {
  const arbitrageSwapAddress = '0xb11E2f29695B57D42A43bac763F8A167EbCE455c'
  const userPrivateKey = ''
  const rpc = MAINNET_RPC
  const chainId = MAINNET_CHAIN_ID
  const USDCAddress = USDC_MAINNET_ADDRESS
  const USDTAddress = USDT_MAINNET_ADDRESS
  const vaultAddress = '0x4F8BDF24826EbcF649658147756115Ee867b7D63'

  const provider = new ethers.providers.JsonRpcProvider(rpc, chainId)
  const signer = new Wallet(userPrivateKey, provider)

  const tokenAmount = BigNumber.from(10).pow(6).mul(100)

  const arbitrageSwap = ArbitrageSwap__factory.connect(
    arbitrageSwapAddress,
    signer,
  )

  const vault = IVault__factory.connect(vaultAddress, signer)

  const funds: FundManagement = {
    sender: arbitrageSwapAddress,
    recipient: arbitrageSwapAddress,
    fromInternalBalance: false,
    toInternalBalance: false,
  }

  const tokenAddresses = [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x82455018f2c32943b3f12f4e59d0da2faf2257ef',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
  ]

  const swaps = [
    {
      poolId:
        '0x10787c272d37253c3d50d12665d97b748e52b01a00020000000000000000000f',
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: '5687922',
      userData: '0x',
      returnAmount: '20322',
    },
    {
      poolId:
        '0xd0b29dda7bf9ba85f975170e31040a959e4c59e1000100000000000000000004',
      assetInIndex: 1,
      assetOutIndex: 2,
      amount: '0',
      userData: '0x',
      returnAmount: '3312068067817542',
    },
    {
      poolId:
        '0x10787c272d37253c3d50d12665d97b748e52b01a00020000000000000000000f',
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: '5312078',
      userData: '0x',
      returnAmount: '18117',
    },
    {
      poolId:
        '0xd0b29dda7bf9ba85f975170e31040a959e4c59e1000100000000000000000004',
      assetInIndex: 1,
      assetOutIndex: 3,
      amount: '0',
      userData: '0x',
      returnAmount: '923431372008484412152',
    },
    {
      poolId:
        '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
      assetInIndex: 3,
      assetOutIndex: 2,
      amount: '0',
      userData: '0x',
      returnAmount: '2943798300617357',
    },
  ]

  const MaxUint256: BigNumber = BigNumber.from(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )

  const limits = await vault.callStatic.queryBatchSwap(
    SwapTypes.SwapExactIn,
    swaps,
    tokenAddresses,
    funds,
  )
  const hadoukenCallData = await vault.interface.encodeFunctionData(
    'batchSwap',
    [SwapTypes.SwapExactIn, swaps, tokenAddresses, funds, limits, MaxUint256],
  )

  const callData = await arbitrageSwap.changeAmountInHadoukenCallData(
    hadoukenCallData,
    BigNumber.from('10990000'),
  )

  // const contractCallData = await arbitrageSwap.encodeBatchSwap(
  //   SwapTypes.SwapExactIn,
  //   swaps,
  //   tokenAddresses,
  //   funds,
  //   limits,
  //   MaxUint256,
  // )

  const decoded = await vault.interface.decodeFunctionData('batchSwap', calData)
  console.log({ decoded })

  // const tx = await arbitrageSwap.arbitrage({
  //   quoteAmount: tokenAmount,
  //   baseTokenAddress: ethAddress,
  //   quoteTokenAddress: pCKBAddress,
  //   order: 0,
  //   hadoukenPoolId:
  //     "0xaea765ef470fd9aa24853bb1ce5f21c6879349c2000200000000000000000002",
  //   yokaiPoolAddress: "0xf4b5cd842e1962ca5b59327fe4bbf5b845c18669",
  // });
  // console.log({ tx });
  // const res = await tx.wait();
  // console.log({ res });
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
