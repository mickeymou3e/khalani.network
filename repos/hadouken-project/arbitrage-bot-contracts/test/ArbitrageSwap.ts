import { ethers } from 'hardhat'
import { expect } from 'chai'
import { IVault__factory } from '../typechain-types'
import { FundManagement, SwapTypes } from '@hadouken-project/sdk'
import { BigNumber } from 'ethers'

describe('Change hadouken call data total in after yokai', function () {
  let hadoukenCallData
  let arbitrageSwap
  let vault
  const originialTotalIn = BigNumber.from('11000000') // 5687922 + 5312078
  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const ArbitrageSwapContract = await ethers.getContractFactory(
      'ArbitrageSwap',
    )

    arbitrageSwap = await ArbitrageSwapContract.deploy(
      '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
      '0x50ff8715E9882a6a184D51D0952Db1Eb311d1988',
      '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      '0xc296f806d15e97243a08334256c705ba5c5754cd',
    )

    const vaultAddress = '0x4F8BDF24826EbcF649658147756115Ee867b7D63'
    vault = IVault__factory.connect(vaultAddress, owner)

    const funds: FundManagement = {
      sender: arbitrageSwap.address,
      recipient: arbitrageSwap.address,
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

    const limits = [
      BigNumber.from(0),
      BigNumber.from(0),
      BigNumber.from(0),
      BigNumber.from(0),
    ]
    hadoukenCallData = await vault.interface.encodeFunctionData('batchSwap', [
      SwapTypes.SwapExactIn,
      swaps,
      tokenAddresses,
      funds,
      limits,
      MaxUint256,
    ])
  })

  it('Decrease total in', async function () {
    const newTotalIn = BigNumber.from('10990000')
    const decodedCallData = await arbitrageSwap.changeAmountInHadoukenCallData(
      hadoukenCallData,
      newTotalIn,
    )
    const updatedSwaps = vault.interface.decodeFunctionData(
      'batchSwap',
      decodedCallData,
    ).swaps
    const totalIn = updatedSwaps[0].amount.add(updatedSwaps[2].amount)
    expect(totalIn.eq(newTotalIn)).to.be.true
  })

  it('Total in is the same', async function () {
    const newTotalIn = BigNumber.from('11000000')
    const decodedCallData = await arbitrageSwap.changeAmountInHadoukenCallData(
      hadoukenCallData,
      newTotalIn,
    )
    const updatedSwaps = vault.interface.decodeFunctionData(
      'batchSwap',
      decodedCallData,
    ).swaps
    const totalIn = updatedSwaps[0].amount.add(updatedSwaps[2].amount)
    expect(totalIn.eq(originialTotalIn)).to.be.true
  })

  it('Increase total in', async function () {
    const newTotalIn = BigNumber.from('11110000')
    const decodedCallData = await arbitrageSwap.changeAmountInHadoukenCallData(
      hadoukenCallData,
      newTotalIn,
    )
    const updatedSwaps = vault.interface.decodeFunctionData(
      'batchSwap',
      decodedCallData,
    ).swaps
    const totalIn = updatedSwaps[0].amount.add(updatedSwaps[2].amount)
    expect(totalIn.eq(newTotalIn)).to.be.true
  })
})
