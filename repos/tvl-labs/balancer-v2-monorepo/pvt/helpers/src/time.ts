import { BigNumber, ContractReceipt } from 'ethers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ethers, network } from 'hardhat';

import { BigNumberish, bn } from './numbers';

export const currentTimestamp = async (): Promise<BigNumber> => {
  const { timestamp } = await network.provider.send('eth_getBlockByNumber', ['latest', true]);
  return bn(timestamp);
};

export const currentWeekTimestamp = async (): Promise<BigNumber> => {
  return (await currentTimestamp()).div(WEEK).mul(WEEK);
};

export const fromNow = async (seconds: number): Promise<BigNumber> => {
  const now = await currentTimestamp();
  return now.add(seconds);
};

export const advanceTime = async (seconds: BigNumberish): Promise<void> => {
  await ethers.provider.send('evm_increaseTime', [parseInt(seconds.toString())]);
  await ethers.provider.send('evm_mine', []);
};

export const advanceToTimestamp = async (timestamp: BigNumberish): Promise<void> => {
  await setNextBlockTimestamp(timestamp);
  await ethers.provider.send('evm_mine', []);
};

export const setNextBlockTimestamp = async (timestamp: BigNumberish): Promise<void> => {
  await ethers.provider.send('evm_setNextBlockTimestamp', [parseInt(timestamp.toString())]);
};

export const lastBlockNumber = async (): Promise<number> => Number(await network.provider.send('eth_blockNumber'));

export const receiptTimestamp = async (receipt: ContractReceipt | Promise<ContractReceipt>): Promise<number> => {
  const blockHash = (await receipt).blockHash;
  const block = await ethers.provider.getBlock(blockHash);
  return block.timestamp;
};

export const SECOND = 1;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
