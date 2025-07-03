import { ethers } from "ethers";
import { prepare_contract_abi } from "../../../utils/prepare_contracts";

import { deployer } from "../deployment.godwoken";

import { ERC20 } from '../../../src/contracts';
import * as ERC20JSON from '../../../build/contracts/ERC20.json'

async function callERC20() {
  const polyjuiceAdminAddress = '0x8016dcd1af7c8cceda53e4d2d2cd4e2924e245b6'
  
  const tokenAddress = '0x24265b88cf593b328357505f5a9da060152d3af9'

  const tokenContract = new ethers.Contract(
    tokenAddress,
    JSON.stringify(prepare_contract_abi(ERC20JSON.abi)),
    deployer.provider
  ).connect(deployer) as ERC20;

  for(let times = 1; times > 0; times--) {
    const balance = await tokenContract.balanceOf(polyjuiceAdminAddress)
    console.log(`Balance ${times}`, balance.toString())
  }
}

callERC20()