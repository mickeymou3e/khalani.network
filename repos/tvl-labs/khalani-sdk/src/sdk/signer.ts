import { providers, Wallet } from 'ethers'
import { E2E_PRIVATE_KEY_HEX } from '../e2e/config'

//TO-DO: Remove when remove ethers v5 (this is v5 implementation)
export class Signer {
  getSignerv5(rpcUrl: string): Wallet {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    const signer = new Wallet(E2E_PRIVATE_KEY_HEX, provider)

    return signer
  }
}
