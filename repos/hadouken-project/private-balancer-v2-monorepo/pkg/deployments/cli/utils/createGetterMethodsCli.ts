import chalk from 'chalk';
import prompts from 'prompts';

import { CliProps } from '../types';
import { ethers } from 'hardhat';

import { mapFunctionInput } from './promptMappings';

const createGetterMethodsCli = (abi: unknown[]) =>
  async function getterMethodsCli(address: string, cliProps: CliProps): Promise<void> {
    const deployer = cliProps.environment.deployer;

    const poolContract = await ethers.getContractAt(abi, address, deployer);

    const { functionName } = await prompts(
      {
        type: 'select',
        name: 'functionName',
        message: 'Select contract function',
        choices: Object.keys(poolContract.interface.functions)
          .filter((contractFunctionName) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const contractFunction = (poolContract.interface.functions as { [key: string]: any })[contractFunctionName];
            return contractFunction.inputs.length === 0;
          })
          .map((contractFunction) => ({
            title: contractFunction,
            value: contractFunction,
          })),
      },
      {
        onCancel: () => {
          return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
        },
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contractFunction = (poolContract.interface.functions as { [key: string]: any })[functionName];

    const contractFunctionInputs = [];
    for (const input of contractFunction.inputs) {
      const { type, name } = input;
      const inputValue = await mapFunctionInput(type, name);

      contractFunctionInputs.push(inputValue);
    }

    const contractFunctionName = contractFunction.name as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactionResult = await (poolContract.functions as any)[contractFunctionName].call(contractFunctionInputs);

    console.log(chalk.bgYellow(chalk.black(contractFunction.name)), chalk.yellow(transactionResult.toString()));

    return getterMethodsCli(address, cliProps);
  };

export default createGetterMethodsCli;
