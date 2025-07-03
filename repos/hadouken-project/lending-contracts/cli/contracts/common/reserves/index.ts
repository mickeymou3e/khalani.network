import prompts from 'prompts';

import { Cli, ScriptRunEnvironment } from '@src/types';

import { BigNumber } from 'ethers';

import { amountSelectorCli, tokenSelectorCli } from '@cli/commands/prompt';
import { RESERVE_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { ConfigureReserve } from '@scripts/helpers/reserves/configure';
import { enableReserve } from '@scripts/helpers/reserves/enable';
import { enableBorrow } from '@scripts/helpers/reserves/enableBorrow';
import { enableStableRate } from '@scripts/helpers/reserves/enableStableRate';
import { freezeReserve } from '@scripts/helpers/reserves/freeze';
import { getInterestRateStrategy } from '@scripts/helpers/reserves/getInterestRateStrategy';
import { setBorrowCap } from '@scripts/helpers/reserves/setBorrowCap';
import { setDepositCap } from '@scripts/helpers/reserves/setDepositCap';
import { setInterestRateStrategy } from '@scripts/helpers/reserves/setInterestRateStrategy';
import { getContractsConfigInstant } from '@src/utils';

export const ReserveCli: Cli = async ({ environment, parentCli }) => {
  const { env, chainId } = environment;
  const config = getContractsConfigInstant(chainId, env, true);

  if (config) {
    const token = await tokenSelectorCli(environment);

    if (!token) throw Error('token not selected');

    const { action } = await prompts(
      {
        type: 'select',
        name: 'action',
        message: 'Select method',
        choices: [
          {
            title: RESERVE_CLI_COMMANDS.getBProtocol.toString(),
            value: RESERVE_CLI_COMMANDS.getBProtocol,
          },
          {
            title: RESERVE_CLI_COMMANDS.setBProtocol.toString(),
            value: RESERVE_CLI_COMMANDS.setBProtocol,
          },
          {
            title: RESERVE_CLI_COMMANDS.getBorrowCap.toString(),
            value: RESERVE_CLI_COMMANDS.getBorrowCap,
          },
          {
            title: RESERVE_CLI_COMMANDS.getDepositCap.toString(),
            value: RESERVE_CLI_COMMANDS.getDepositCap,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.setBorrowCap.toString()} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.setBorrowCap,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.setDepositCap.toString()} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.setDepositCap,
          },
          {
            title: RESERVE_CLI_COMMANDS.getConfiguration.toString(),
            value: RESERVE_CLI_COMMANDS.getConfiguration,
          },
          {
            title: RESERVE_CLI_COMMANDS.setConfiguration.toString(),
            value: RESERVE_CLI_COMMANDS.setConfiguration,
          },
          {
            title: RESERVE_CLI_COMMANDS.getInterestRateStrategy.toString(),
            value: RESERVE_CLI_COMMANDS.getInterestRateStrategy,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.freeze} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.freeze,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.enable.toString()} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.enable,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.enableBorrow.toString()} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.enableBorrow,
          },
          {
            title: `${RESERVE_CLI_COMMANDS.enableStableBorrow.toString()} (Gnosis support)`,
            value: RESERVE_CLI_COMMANDS.enableStableBorrow,
          },
          {
            title: RESERVE_CLI_COMMANDS.setInterestRateStrategy.toString(),
            value: RESERVE_CLI_COMMANDS.setInterestRateStrategy,
          },
          {
            title: RESERVE_CLI_COMMANDS.updateInterestRateStrategy.toString(),
            value: RESERVE_CLI_COMMANDS.updateInterestRateStrategy,
          },
        ],
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    switch (action) {
      case RESERVE_CLI_COMMANDS.getBProtocol:
        const pool = connectToContractsRuntime(environment).pool;
        const bProAddress = await pool?.getBProtocol(token.address);
        console.log(`BProtocol for ${token.address}: ${bProAddress}`);
        break;
      case RESERVE_CLI_COMMANDS.setBProtocol: {
        const pool = connectToContractsRuntime(environment).pool;
        const bProAddress = await pool?.getBProtocol(token.address);
        const newBProAddress = await amountSelectorCli(
          `Previous BProtocol address: ${bProAddress} New one:`
        );
        if (!newBProAddress) throw 'The new address is invalid!';
        const txReceipt = await pool?.setBProtocol(token.address, newBProAddress.toString());
        await txReceipt?.wait();
        console.log(`BProtocol for ${token.address}: ${newBProAddress}`);
        break;
      }
      case RESERVE_CLI_COMMANDS.getDepositCap:
        const { depositCap } = await getAssetConfig(environment, token.address);
        console.log('depositCap', depositCap.toString());
        break;
      case RESERVE_CLI_COMMANDS.getBorrowCap:
        const { borrowCap } = await getAssetConfig(environment, token.address);
        console.log('borrowCap', borrowCap.toString());
        break;
      case RESERVE_CLI_COMMANDS.setBorrowCap:
        const { borrowCap: previousBorrowCap } = await getAssetConfig(environment, token.address);

        const borrowCapAmount = await amountSelectorCli(
          `Previous borrow cap(${previousBorrowCap.toString()}), New one:`
        );

        await setBorrowCap(environment, token.address, BigNumber.from(borrowCapAmount));

        break;
      case RESERVE_CLI_COMMANDS.setDepositCap:
        const { depositCap: previousDepositCap } = await getAssetConfig(environment, token.address);

        const depositCapAmount = await amountSelectorCli(
          `Previous deposit cap(${previousDepositCap.toString()}), New one:`
        );

        await setDepositCap(environment, token.address, BigNumber.from(depositCapAmount));
        break;
      case RESERVE_CLI_COMMANDS.getConfiguration:
        const {
          ltv,
          liqThreshold,
          liqBonus,
          decimals,
          borrowingEnable,
          isActive,
          isFrozen,
          stableRateBorrowEnable,
          reserved,
          reservedFactory,
        } = await getAssetConfig(environment, token.address);

        console.table([
          { name: 'ltv', value: ltv.toString() },
          { name: 'liqThreshold', value: liqThreshold.toString() },
          { name: 'liqBonus', value: liqBonus.toString() },
          { name: 'decimals', value: decimals.toString() },
          { name: 'borrowingEnable', value: borrowingEnable },
          { name: 'isActive', value: isActive },
          { name: 'isFrozen', value: isFrozen },
          { name: 'stableRateBorrowEnable', value: stableRateBorrowEnable },
          { name: 'reserved', value: reserved.toString() },
          { name: 'reservedFactory', value: reservedFactory.toString() },
        ]);
        break;
      case RESERVE_CLI_COMMANDS.setConfiguration:
        const {
          ltv: currentLtv,
          liqThreshold: currentLiqThreshold,
          liqBonus: currentLiqBonus,
        } = await getAssetConfig(environment, token.address);

        const newLtv = await amountSelectorCli(`LTV: (previous: ${currentLtv.toString()})`);

        const liquidationThreshold = await amountSelectorCli(
          `LiquidationThreshold: (previous: ${currentLiqThreshold.toString()})`
        );

        const liquidationBonus = await amountSelectorCli(
          `LiquidationBonus: (previous: ${currentLiqBonus.toString()})`
        );

        await ConfigureReserve(
          environment,
          token.address,
          !newLtv ? currentLtv : BigNumber.from(newLtv),
          !liquidationThreshold ? currentLiqThreshold : BigNumber.from(liquidationThreshold),
          !liquidationBonus ? currentLiqBonus : BigNumber.from(liquidationBonus)
        );
        break;
      case RESERVE_CLI_COMMANDS.freeze:
        const { freeze } = await prompts(
          {
            type: 'toggle',
            name: 'freeze',
            message: `Freeze asset`,
            initial: true,
          },
          {
            onCancel: () => {
              return parentCli ? parentCli({ environment }) : process.exit(0);
            },
          }
        );

        await freezeReserve(environment, token.address, freeze);
        break;
      case RESERVE_CLI_COMMANDS.getInterestRateStrategy:
        await getInterestRateStrategy(environment, token);
        break;
      case RESERVE_CLI_COMMANDS.setInterestRateStrategy:
        await setInterestRateStrategy(environment, token);
        break;
      case RESERVE_CLI_COMMANDS.updateInterestRateStrategy:
        console.log('todo');
        // const marketConfig = getMarketConfig(environment, [token.symbol]);
        // const { ReservesConfig, ReserveAssets } = marketConfig;
        // const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env);
        // const config = getConfigInstant(environment.chainId, environment.env);

        // const addressProviderContract = connectLendingPoolAddressProvider(
        //   contractsConfig.addressProvider,
        //   environment.deployer
        // );

        // const strategyAddresses = await deployReservesStrategies(
        //   ReservesConfig,
        //   ReserveAssets,
        //   addressProviderContract,
        //   environment,
        //   Number(config.delay)
        // );

        // const poolConfigurator = await connectLendingPoolConfigurator(
        //   contractsConfig.poolConfiguratorProxy,
        //   environment.deployer
        // );
        // const strategyName = Object.keys(strategyAddresses)[0];

        // const setStrategyTransaction = await poolConfigurator.setReserveInterestRateStrategyAddress(
        //   token.address,
        //   strategyAddresses[strategyName],
        //   environment.transactionOverrides
        // );
        // await setStrategyTransaction.wait();

        // const lendingRateOracle = connectLendingRateOracle(
        //   contractsConfig.lendingRateOracle,
        //   environment.deployer
        // );

        // const reserve = Object.entries(ReservesConfig);

        // await (
        //   await lendingRateOracle.setMarketBorrowRate(
        //     token.address,
        //     reserve[0][1].strategy.baseStableBorrowRate
        //   )
        // ).wait();

        // console.log(`New reserve strategy deployed at address: ${strategyAddresses[strategyName]}`);
        break;
      case RESERVE_CLI_COMMANDS.enable:
        const { enable } = await prompts(
          {
            type: 'toggle',
            name: 'enable',
            message: `Enable asset`,
            initial: true,
          },
          {
            onCancel: () => {
              return parentCli ? parentCli({ environment }) : process.exit(0);
            },
          }
        );

        await enableReserve(environment, token.address, enable);
        break;

      case RESERVE_CLI_COMMANDS.enableBorrow:
        const { enableBorrowAsset } = await prompts(
          {
            type: 'toggle',
            name: 'enableBorrowAsset',
            message: `Enable borrow asset`,
            initial: true,
          },
          {
            onCancel: () => {
              return parentCli ? parentCli({ environment }) : process.exit(0);
            },
          }
        );

        const { stableRateBorrowEnable: currentStableBorrow } = await getAssetConfig(
          environment,
          token.address
        );

        await enableBorrow(environment, token.address, enableBorrowAsset, currentStableBorrow);
        break;
      case RESERVE_CLI_COMMANDS.enableStableBorrow:
        const { enableStableRateBorrow } = await prompts(
          {
            type: 'toggle',
            name: 'enableStableRateBorrow',
            message: `Enable borrow asset`,
            initial: true,
          },
          {
            onCancel: () => {
              return parentCli ? parentCli({ environment }) : process.exit(0);
            },
          }
        );

        await enableStableRate(environment, token.address, enableStableRateBorrow);
        break;
    }
  }
};

const getAssetConfig = async (
  environment: ScriptRunEnvironment,
  asset: string
): Promise<{
  ltv: BigNumber;
  liqThreshold: BigNumber;
  liqBonus: BigNumber;
  decimals: number;
  isActive: boolean;
  isFrozen: boolean;
  borrowingEnable: boolean;
  stableRateBorrowEnable: boolean;
  reserved: BigNumber;
  reservedFactory: BigNumber;
  depositCap: BigNumber;
  borrowCap: BigNumber;
}> => {
  const pool = connectToContractsRuntime(environment).pool;

  if (!pool) throw Error('pool not found');

  const { data } = await pool.getConfiguration(asset);

  // bitmask was used.
  // bit 0-15: LTV
  // bit 16-31: Liq. threshold
  // bit 32-47: Liq. bonus
  // bit 48-55: Decimals
  // bit 56: reserve is active
  // bit 57: reserve is frozen
  // bit 58: borrowing is enabled
  // bit 59: stable rate borrowing enabled
  // bit 60-63: reserved
  // bit 64-79: reserve factor
  // bit 80-115: borrow cap
  // bit 116-151: deposit cap

  const ltv = data.mask(15);
  const liqThreshold = data.shr(16).mask(15);
  const liqBonus = data.shr(32).mask(15);
  const decimals = data.shr(48).mask(7).toNumber();
  const isActive = Boolean(data.shr(56).mask(1).toNumber());
  const isFrozen = Boolean(data.shr(57).mask(1).toNumber());
  const borrowingEnable = Boolean(data.shr(58).mask(1).toNumber());
  const stableRateBorrowEnable = Boolean(data.shr(59).mask(1).toNumber());
  const reserved = data.shr(60).mask(3);
  const reservedFactory = data.shr(64).mask(15);
  const borrowCap = data.shr(80).mask(35);
  const depositCap = data.shr(116).mask(35);

  return {
    ltv,
    liqThreshold,
    liqBonus,
    decimals,
    isActive,
    isFrozen,
    borrowingEnable,
    stableRateBorrowEnable,
    reserved,
    reservedFactory,
    borrowCap,
    depositCap,
  };
};
