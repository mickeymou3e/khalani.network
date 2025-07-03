import lockdropAbi from '../../../typechain/abi/HadoukenLockdrop.json';
import tokenAbi from '../../../typechain/abi/ERC20.json';

import { getDeploymentsByRuntimeEnv } from '../../../config/src/deployments';
import { ScriptRunEnvironment } from '../types';
import { lockdrop as config } from '../../../config/src';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

export async function finalizePhaseTwo(env: ScriptRunEnvironment) {
  const { HadoukenLockdrop, HadoukenToken } = getDeploymentsByRuntimeEnv(env.network);
  const networkConfig = config.chains.find(({ chainId }) => chainId === env.chainId);
  if (!networkConfig) throw `No config for network ${env.network}`;

  const poolAddress = networkConfig.poolAddress;
  const lockdrop = new ethers.Contract(HadoukenLockdrop, lockdropAbi, env.deployer);

  const hdkAvailable = await lockdrop.availableHDKLiquidity();
  const dust = (await lockdrop.DUST()) as BigNumber;

  const depositedHDK = await lockdrop.totalDepositedHDK();

  console.log(depositedHDK.toString(), hdkAvailable.toString());

  const bonusHdk = hdkAvailable.mul(BigNumber.from(networkConfig.bonusHDK)).div(10000);
  console.log(`bonus HDK: ${bonusHdk.toString()}`);
  const hdkToken = new ethers.Contract(HadoukenToken, tokenAbi.abi, env.deployer);
  const txBonusHdk = await hdkToken.approve(HadoukenLockdrop, bonusHdk.add(dust));
  const receiptBonusHdk = await txBonusHdk.wait();
  console.log(receiptBonusHdk);

  console.log(config.phaseThreeStartTime);

  console.log('Executing finalization of phase two with parameters:');
  console.log(`Phase three start time: ${config.phaseThreeStartTime}`);
  console.log(`Pool address: ${poolAddress.toString()}`);

  const tx = await lockdrop.finalizePhaseTwo(config.phaseThreeStartTime, poolAddress, bonusHdk);
  const receipt = await tx.wait();
  console.log(receipt);
}
