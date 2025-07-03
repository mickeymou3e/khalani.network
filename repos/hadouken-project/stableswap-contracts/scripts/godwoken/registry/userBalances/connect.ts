
import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as UserBalancesJSON from '../../../../build/contracts/UserBalances.json'
import { UserBalances } from '../../../../src/contracts';

export default function connect(address: string, deployer: Signer) {
  const userBalancesContract = new ethers.Contract(
    address,
    prepare_contract_abi(UserBalancesJSON.abi),
    deployer.provider
  ).connect(deployer) as UserBalances;

  return userBalancesContract
}