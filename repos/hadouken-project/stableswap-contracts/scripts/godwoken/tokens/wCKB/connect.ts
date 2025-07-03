
import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as WCKBJSON from '../../../../build/contracts/WCKB.json'
import { WCKB } from '../../../../src/contracts';

export default function connect(address: string, deployer: Signer) {
    const erc20Contract = new ethers.Contract(
      address,
      prepare_contract_abi(WCKBJSON.abi),
      deployer.provider
    ).connect(deployer) as WCKB;

    return erc20Contract
}
