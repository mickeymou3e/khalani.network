import { ERC20__factory, HadoukenLockdrop__factory } from '@hadouken-project/typechain';
import { getDeploymentsAddresses } from '../config.command';
import { ScriptRunEnvironment } from '../types';
import { lockdrop as config } from '../../../config/src';
import { BigNumber } from 'ethers';

export async function finalizePhaseTwo(env: ScriptRunEnvironment) {
  const { HadoukenLockdrop, HadoukenToken } = getDeploymentsAddresses(env.network);
  const networkConfig = config.chains.find(({ chainId }) => chainId === env.chainId);
  if (!networkConfig) throw `No config for network ${env.network}`;

  const poolAddress = networkConfig.poolAddress;
  const lockdrop = HadoukenLockdrop__factory.connect(HadoukenLockdrop, env.deployer);

  const hdkAvailable = await lockdrop.availableHDKLiquidity();
  const dust = await lockdrop.DUST();

  const bonusHdk = hdkAvailable.mul(BigNumber.from(networkConfig.bonusHDK)).div(10000);
  console.log(`bonus HDK: ${bonusHdk.toString()}`);
  const hdkToken = ERC20__factory.connect(HadoukenToken, env.deployer);
  const txBonusHdk = await hdkToken.approve(HadoukenLockdrop, bonusHdk.add(dust));
  const receiptBonusHdk = await txBonusHdk.wait();
  console.log(receiptBonusHdk);

  console.log('Executing finalization of phase two with parameters:');
  console.log(`Phase three start time: ${config.phaseThreeStartTime}`);
  console.log(`Pool address: ${poolAddress.toString()}`);

  const tx = await lockdrop.finalizePhaseTwo(config.phaseThreeStartTime, poolAddress, bonusHdk);
  const receipt = await tx.wait();
  console.log(receipt);
}
