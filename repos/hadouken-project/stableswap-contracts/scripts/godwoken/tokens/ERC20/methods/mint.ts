import { Signer, Overrides } from 'ethers';

import connect from '../connect'

export async function mint(
  symbol: string,
  address: string,
  account: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Token][ERC20][${symbol}] Mint`)
  const token = connect(address, deployer)

  const mintTransaction = await token.claimTestToken(account, transactionOverrides)
  const receipt = await mintTransaction.wait()

  const transactionHash = receipt.transactionHash

  console.log(`[Token][ERC20][${symbol}] Minted`, transactionHash)

  return transactionHash
}