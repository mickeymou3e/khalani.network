
import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../utils/prepare_contracts'
import * as ERC20HDKJSON from '../../../build/contracts/ERC20HDK.json'

import { ERC20HDK } from '../../../src/contracts';


export function connectDaoToken(
  daoToken: string,
  deployer: Signer,
) {
    const daoTokenContract = new ethers.Contract(
      daoToken,
      prepare_contract_abi(ERC20HDKJSON.abi),
      deployer.provider
    ).connect(deployer) as ERC20HDK;
  
    return daoTokenContract
}
