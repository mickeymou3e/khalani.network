import { ethers, Signer } from 'ethers';

import * as ForceBridgeERC20JSON from '../../../../build/contracts/ForceBridgeERC20.json'
import { ForceBridgeERC20 } from '../../../../src/contracts';

export default function connect(address: string, deployer: Signer) {
  const forceBridgeERC20Contract = new ethers.Contract(
    address,
    ForceBridgeERC20JSON.abi,
    deployer.provider
  ).connect(deployer) as ForceBridgeERC20;

  return forceBridgeERC20Contract
}
