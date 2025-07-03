import { tokenSelectorCli } from '@cli/commands/prompt';
import { PRICE_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { changeOraclePrice } from '@scripts/helpers/oracle/changePrice';
import { Cli, ScriptRunEnvironment } from '@src/types';
import { BigNumber } from 'ethers';
import prompts from 'prompts';

export const mapTokenSymbolForOracle = (symbol: string): string =>
  symbol.replace(/^W/, '').replace(/.e$/, '');

const getPriceFromHadoukenOracle = async (
  environment: ScriptRunEnvironment,
  tokenAddress: string
) => {
  const hadoukenOracle = connectToContractsRuntime(environment).hadoukenOracle;
  if (!hadoukenOracle) throw Error('hadoukenOracle not found');

  return await hadoukenOracle.getAssetPrice(tokenAddress);
};

const getPriceFromBandOracleProvider = async (
  environment: ScriptRunEnvironment,
  tokenAddress: string
) => {
  const bandProvider = connectToContractsRuntime(environment).oracleBandProvider;
  if (!bandProvider) throw Error('bandProvider not found');

  return await bandProvider.getAssetPrice(tokenAddress);
};

const getPriceFromDIAOracleProvider = async (
  environment: ScriptRunEnvironment,
  tokenAddress: string
) => {
  const diaOracleProvider = connectToContractsRuntime(environment).OracleDiaProvider;
  if (!diaOracleProvider) throw Error('diaOracleProvider not found');

  return await diaOracleProvider.getAssetPrice(tokenAddress);
};

const getPriceFromBandOracle = async (environment: ScriptRunEnvironment, tokenSymbol: string) => {
  const bandOracle = connectToContractsRuntime(environment).stdReference;
  if (!bandOracle) throw Error('bandOracle not found');

  return await bandOracle.getReferenceData(tokenSymbol, 'USD');
};

const getPriceFromDiaOracle = async (environment: ScriptRunEnvironment, tokenSymbol: string) => {
  const diaOracle = connectToContractsRuntime(environment).diaOracle;
  if (!diaOracle) throw Error('diaOracle not found');

  return await diaOracle.getValue(`${tokenSymbol}/USD`);
};

const providerPrice = {
  [PRICE_CLI_COMMANDS.hadoukenOracle]: getPriceFromHadoukenOracle,
  [PRICE_CLI_COMMANDS.bandProvider]: getPriceFromBandOracleProvider,
  [PRICE_CLI_COMMANDS.diaProvider]: getPriceFromDIAOracleProvider,
  [PRICE_CLI_COMMANDS.bandOracle]: getPriceFromBandOracle,
  [PRICE_CLI_COMMANDS.diaOracle]: getPriceFromDiaOracle,
};

export const GetPriceCli: Cli = async ({ environment, parentCli }) => {
  const { provider } = await prompts(
    {
      type: 'select',
      name: 'provider',
      message: 'Select provider',
      choices: [
        {
          value: PRICE_CLI_COMMANDS.hadoukenOracle,
          title: PRICE_CLI_COMMANDS.hadoukenOracle.toString(),
        },
        {
          value: PRICE_CLI_COMMANDS.bandProvider,
          title: PRICE_CLI_COMMANDS.bandProvider.toString(),
        },
        {
          value: PRICE_CLI_COMMANDS.diaProvider,
          title: PRICE_CLI_COMMANDS.diaProvider.toString(),
        },
        {
          value: PRICE_CLI_COMMANDS.bandOracle,
          title: PRICE_CLI_COMMANDS.bandOracle.toString(),
        },
        {
          value: PRICE_CLI_COMMANDS.diaOracle,
          title: PRICE_CLI_COMMANDS.diaOracle.toString(),
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  const erc20 = await tokenSelectorCli(environment);
  if (!erc20) throw Error('erc20 not provided');

  const currentProvider = providerPrice[provider as PRICE_CLI_COMMANDS];
  const mappedSymbol = mapTokenSymbolForOracle(erc20.symbol);
  const tokenParam =
    provider === PRICE_CLI_COMMANDS.bandOracle || provider === PRICE_CLI_COMMANDS.diaOracle
      ? mappedSymbol
      : erc20.address;

  const price = await currentProvider(environment, tokenParam);

  console.log(`Price for token ${erc20.symbol} for provider ${provider} is: ${price}`);
};

export const UpdatePriceCli: Cli = async ({ environment }) => {
  const erc20 = await tokenSelectorCli(environment);
  if (!erc20) throw Error('erc20 not provided');

  const { price } = await prompts(
    {
      type: 'text',
      name: 'price',
      message: 'price in dollars (10^18)',
    },
    {
      onCancel: () => {
        return;
      },
    }
  );

  const symbolWithoutChainDirection = erc20.symbol.split('.')[0];

  await changeOraclePrice(environment, symbolWithoutChainDirection, BigNumber.from(price));
};
