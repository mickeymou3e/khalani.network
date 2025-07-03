import { Signer, Overrides } from 'ethers';

import connect from '../connect'

export async function decimals(
  address: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const token = connect(address, deployer)

  const decimals = await token.decimals(transactionOverrides)

  return decimals
}