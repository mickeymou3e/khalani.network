import { WalletService } from './WalletService'
import ConfigSchema from '../config/config.schema.json'
import { WithdrawMtokensPayload } from './bcs/bcs'
import { ethers } from 'ethers'
import { fromHex } from '@mysten/bcs'
import { addressToBytes, toU256Bytes } from './bcs/utils'

export class WithdrawService {
  private walletService: WalletService
  private config: typeof ConfigSchema
  constructor(config: typeof ConfigSchema, walletService: WalletService) {
    this.walletService = walletService
    this.config = config
  }

  public async withdrawMtokens(
    mTokenAddress: string,
    userAddress: string,
    amount: bigint,
  ): Promise<{ transactionHash: string }> {
    try {
      const userAddressBytes = addressToBytes(userAddress)
      const mTokenAddressBytes = addressToBytes(mTokenAddress)
      const chain_id = parseInt(this.walletService.getHubChain(), 16)
      const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      const bcsPayload = WithdrawMtokensPayload.serialize({
        chain_id,
        address: userAddressBytes,
        mtoken: mTokenAddressBytes,
        amount: toU256Bytes(amount),
        nonce: toU256Bytes(nonce),
      })
      const signature = await this.walletService.signer?.signMessage(
        bcsPayload.toBytes(),
      )
      if (!signature) {
        throw new Error('Failed to sign message')
      }
      const splitSignature = ethers.utils.splitSignature(signature)
      const sig = {
        r: splitSignature.r,
        s: splitSignature.s,
        yParity: splitSignature.v - 27,
      }
      const rpcPayload = {
        payload: {
          chain_id: chain_id,
          address: userAddress,
          mtoken: mTokenAddress,
          amount: amount.toString(),
          nonce: nonce.toString(),
        },
        signature: sig,
      }
      const response = await fetch(this.config.medusa.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'withdrawMtokens',
          params: [rpcPayload],
          id: nonce.toString(),
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('fetch response data:', JSON.stringify(data, null, 2))

      if (data.error) {
        throw new Error(`Error in JSON-RPC response: ${data.error.message}`)
      }

      return {
        transactionHash: data.result,
      }
    } catch (error) {
      console.error('Error proposing intent:', error)
      throw error
    }
  }
}
