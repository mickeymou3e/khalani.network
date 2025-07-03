import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import prompts from 'prompts';

import { Cli, CliProps, ScriptRunEnvironment } from '../types';

type functionParamType = 'uint256' | 'uint8' | 'address' | 'bytes' | 'uint256[]';

type functionParam = {
  type: string;
  name: string;
};

export const ParameterCli = async (
  name: string,
  type: 'uint256' | 'uint8' | 'address' | 'bytes' | 'uint256[]',
  environment: ScriptRunEnvironment,
  parentCli?: Cli
): Promise<any> => {
  if (type === 'uint256' || type === 'uint8') {
    const { param } = await prompts(
      {
        type: 'text',
        name: 'param',
        message: name,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    return BigNumber.from(param.toLocaleString('fullwide', { useGrouping: false }));
  } else if (type === 'address') {
    const { param } = await prompts(
      {
        type: 'text',
        name: 'param',
        message: name,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (!ethers.utils.isAddress(param)) {
      throw Error('Invalid address');
    }
    return param;
  }
  return null;
};

export const createSetterMethodsCli = (abi: unknown[]) =>
  async function setterMethodsCli(address: string, cliProps: CliProps): Promise<void> {
    const deployer = (await ethers.getSigners())[0];

    const poolContract = await ethers.getContractAt(abi, address, deployer);

    const functions = Object.keys(poolContract.interface.functions)
      .filter((contractFunctionName) => {
        const contractFunction = (poolContract.interface.functions as { [key: string]: any })[contractFunctionName];
        return contractFunction.inputs.length > 0;
      })
      .map((contractFunctionName) => {
        const contractFunction = (poolContract.interface.functions as { [key: string]: any })[contractFunctionName];

        const params: { type: string; name: string }[] = contractFunction.inputs.map(
          (param: functionParam) =>
            ({
              type: param?.type,
              name: param?.name,
            } as functionParam)
        );

        return {
          name: contractFunctionName,
          params: params,
        };
      });

    const { func }: { func: { name: string; params: functionParam[] } } = await prompts(
      {
        type: 'select',
        name: 'func',
        message: 'Select contract function',
        choices: functions.map((data) => ({ title: data.name, value: data })),
      },
      {
        onCancel: () => {
          return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
        },
      }
    );

    const params = [];

    for (const param of func.params) {
      params.push(
        await ParameterCli(param.name, param.type as functionParamType, cliProps.environment, cliProps.parentCli)
      );
    }

    const transactionResult = await poolContract.functions[func.name](...params);
    console.log(transactionResult);
    await transactionResult?.wait?.(2);

    return setterMethodsCli(address, cliProps);
  };
