import { Signer, Overrides } from 'ethers';

import connect from './connect'

export async function setMinter(
  address: string,
  poolAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Lp Token] Set Minter`)
  const lpToken = connect(address, deployer)

  const minterTransaction = await lpToken.set_minter(poolAddress, transactionOverrides)
  const receipt = await minterTransaction.wait()

  const transactionHash = receipt.transactionHash

  console.log(`[Lp Token] Setted Minter`, transactionHash)

  return transactionHash
}