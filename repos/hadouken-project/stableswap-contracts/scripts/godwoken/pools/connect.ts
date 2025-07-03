import { ContractInterface, ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../utils/prepare_contracts'

import { SwapTemplateBase } from '../../../src/contracts';

export default function connect(address: string, abi: ContractInterface, deployer: Signer) {
  const contract = new ethers.Contract(
    address,
    prepare_contract_abi(abi),
    deployer.provider
  ).connect(deployer) as SwapTemplateBase;

  return contract
}