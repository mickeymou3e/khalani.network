import { BigNumber } from 'ethers';
import axios from 'axios';

import { ChainPrices, ScriptRunEnvironment } from '../types';
import { ERC20__factory, HadoukenLockdrop__factory } from '@hadouken-project/typechain';
import { lockdrop as config } from '../../../config/src';
import { getDeploymentsAddresses } from '../config.command';

async function getChainAvailableHDK(chainId: string): Promise<BigNumber> {
  const res = await axios.get(`${config.endpoint}/lockdrops?chainId=${chainId}`);
  const availableHdk = BigNumber.from(res.data.totalUserHdkToClaim);
  return availableHdk;
}

async function getChainTVLWeighted(chainId: string): Promise<BigNumber> {
  const res = await axios.get(`${config.endpoint}/tvl?chainId=${chainId}`);
  const totalTVLWeighted = BigNumber.from(res.data.totalValueLockedWithWeights);
  return totalTVLWeighted;
}

async function getChainPrices(networkName: string): Promise<ChainPrices> {
  const networkConfig = config.chains.find(({ chainId }) => chainId === networkName);
  if (!networkConfig) throw `No config for network ${networkName}`;
  const { husdAddress, triCryptoAddress } = networkConfig;

  const res = await axios.get(`${config.endpoint}/prices`);
  return { husd: BigNumber.from(res.data[husdAddress]), triCrypto: BigNumber.from(res.data[triCryptoAddress]) };
}

export async function finalizePhaseOne(env: ScriptRunEnvironment) {
  const availableHdk = await getChainAvailableHDK(env.chainId);
  const TVLWeighted = await getChainTVLWeighted(env.chainId);
  const { husd, triCrypto } = await getChainPrices(env.chainId);
  const { HadoukenLockdrop, HadoukenToken } = getDeploymentsAddresses(env.network);

  const lockdrop = HadoukenLockdrop__factory.connect(HadoukenLockdrop, env.deployer);
  const ERC20Contract = ERC20__factory.connect(HadoukenToken, env.deployer);
  console.log(`Approving ${availableHdk.toString()} HDK for lockdrop contract`);
  const dust = await lockdrop.DUST();
  const approveTx = await ERC20Contract.approve(HadoukenLockdrop, availableHdk.add(dust));
  const approveReceipt = await approveTx.wait();
  console.log(approveReceipt);

  console.log('Executing finalization of phase one with parameters:');
  console.log(`Available HDK: ${availableHdk.toString()}`);
  console.log(`Total TVl weighted: ${TVLWeighted.toString()}`);
  console.log(`Phase two start time: ${config.phaseTwoStartTime}`);
  console.log(`HUSD price: ${husd.toString()}`);
  console.log(`TriCrypto price: ${triCrypto.toString()}`);
  const tx = await lockdrop.finalizePhaseOne(availableHdk, TVLWeighted, config.phaseTwoStartTime, husd, triCrypto);
  const receipt = await tx.wait();
  console.log(receipt);
}
