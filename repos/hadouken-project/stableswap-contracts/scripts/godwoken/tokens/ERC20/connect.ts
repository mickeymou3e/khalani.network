
import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as ERC20JSON from '../../../../build/contracts/ERC20.json'
import { ERC20 } from '../../../../src/contracts';

export default function connect(address: string, deployer: Signer) {
  const erc20Contract = new ethers.Contract(
    address,
    prepare_contract_abi(ERC20JSON.abi),
    deployer.provider
  ).connect(deployer) as ERC20;

  return erc20Contract
}