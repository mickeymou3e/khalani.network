import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as SudtERC20JSON from '../../../../build/contracts/SudtERC20.json'
import { SudtERC20 } from '../../../../src/contracts';

export default function connect(address: string, deployer: Signer) {
  const erc20Contract = new ethers.Contract(
    address,
    prepare_contract_abi(SudtERC20JSON.abi),
    deployer.provider
  ).connect(deployer) as SudtERC20;

  return erc20Contract
}
