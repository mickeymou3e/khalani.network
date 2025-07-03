import { ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as HadoukenTokenJSON from '../../../../build/contracts/HadoukenToken.json'
import { HadoukenToken } from '../../../../src/contracts';


export default function connect(address: string, deployer: Signer) {
    const hadoukenTokenContract = new ethers.Contract(
        address,
        JSON.stringify(prepare_contract_abi(HadoukenTokenJSON.abi)),
        deployer.provider
    ).connect(deployer) as HadoukenToken

    return hadoukenTokenContract
}
    