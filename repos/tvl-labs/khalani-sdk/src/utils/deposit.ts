import { Network } from '@constants/Networks'
import { ethers } from 'ethers-v6'
import { NetworkType } from '@enums/index'

const networkType = process.env.NETWORK || NetworkType.TESTNET

export const getDepositFee = (sourceChain?: Network) => {
  if (networkType === NetworkType.TESTNET) {
    return ethers.parseEther('0.001')
  } else if (networkType === NetworkType.MAINNET) {
    if (sourceChain === Network.Arbitrum) {
      return ethers.parseEther('0.0006')
    } else {
      return ethers.parseEther('0.002')
    }
  } else {
    throw new Error('Invalid network type')
  }
}

export const getDepositDestinationChain = () => {
  if (networkType === NetworkType.TESTNET) {
    return Network.Khalani
  } else if (networkType === NetworkType.MAINNET) {
    return Network.ArcadiaMainnet
  } else {
    throw new Error('Invalid network type')
  }
}
