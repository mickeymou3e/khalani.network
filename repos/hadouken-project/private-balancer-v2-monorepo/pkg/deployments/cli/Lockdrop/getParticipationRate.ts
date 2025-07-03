import { HadoukenLockdrop__factory } from '@hadouken-project/typechain';
import { getDeploymentsAddresses } from '../config.command';
import { ScriptRunEnvironment } from '../types';
import { lockdrop as config } from '../../../config/src';

export const PARTICIPATION_RATE = [
  {
    participationRate: '90 - 100',
    bonusAllocation: 5,
    range: [90, 100],
  },
  {
    participationRate: '80 - 89.99',
    bonusAllocation: 5.56,
    range: [80, 89.99],
  },
  {
    participationRate: '70 - 79.99',
    bonusAllocation: 6.25,
    range: [70, 79.99],
  },
  {
    participationRate: '60 - 69.99',
    bonusAllocation: 7.14,
    range: [60, 69.99],
  },
  {
    participationRate: '50 - 59.99',
    bonusAllocation: 8.33,
    range: [50, 59.99],
  },
  {
    participationRate: '40 - 49.99',
    bonusAllocation: 10,
    range: [40, 49.99],
  },
  {
    participationRate: '30 - 39.99',
    bonusAllocation: 12.5,
    range: [30, 39.99],
  },
  {
    participationRate: '20 - 29.99',
    bonusAllocation: 16.67,
    range: [20, 29.99],
  },
  {
    participationRate: '10 - 19.99',
    bonusAllocation: 25,
    range: [10, 19.99],
  },
  {
    participationRate: '0 - 9.99',
    bonusAllocation: 50,
    range: [0, 9.99],
  },
];

export async function getParticipationRate(env: ScriptRunEnvironment) {
  const { HadoukenLockdrop } = getDeploymentsAddresses(env.network);
  const networkConfig = config.chains.find(({ chainId }) => chainId === env.chainId);
  if (!networkConfig) throw `No config for network ${env.network}`;

  const lockdrop = HadoukenLockdrop__factory.connect(HadoukenLockdrop, env.deployer);

  const hdkAvailable = await lockdrop.availableHDKLiquidity();
  const hdkDeposited = await lockdrop.totalDepositedHDK();

  const participationRate = hdkDeposited.mul(10000).div(hdkAvailable).toNumber() / 100;
  const bonusHDK = PARTICIPATION_RATE.find(
    (element) => element.range[0] <= participationRate && element.range[1] >= participationRate
  );
  if (!bonusHDK) throw "Can't calculate bonus allocation HDK";
  console.log(`Participation rate: ${participationRate} %`);
  console.log(`Bonus allocation: ${bonusHDK.bonusAllocation * 100}`);
}
