import { Signer, Overrides } from 'ethers';

import connect from '../connect'

export async function symbol(
  address: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const token = connect(address, deployer)

  const symbol = await token.symbol(transactionOverrides)

  return symbol
}