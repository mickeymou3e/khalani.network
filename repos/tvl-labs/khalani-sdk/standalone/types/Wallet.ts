import { Network } from './Networks'
import { JsonRpcProvider, Signer } from 'ethers-v6'

export interface WalletState {
  arcadiaProvider: JsonRpcProvider | null
  provider: JsonRpcProvider | null
  signer: Signer | null
  userAddress: string | null
  network: Network | null
}
