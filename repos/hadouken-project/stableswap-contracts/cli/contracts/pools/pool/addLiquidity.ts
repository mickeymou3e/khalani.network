import fs from 'fs';
import prompts from 'prompts';
import { POOLS_CONTRACTS_DIR } from '../../../../scripts/godwoken/pools/constants';

import { addLiquidityAll as addLiquidityAllScript } from '../../../../scripts/godwoken/pools/batch.godwoken'
import {
  addLiquiditySingle as addLiquiditySingleScript
} from '../../../../scripts/godwoken/pools/methods/addLiquidity'

import { ERC20_CONTRACTS_DIR } from '../../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../../../scripts/godwoken/tokens/ERC20/types';
import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../../types';

const addLiquidityCli = async (poolName: string, {
    network,
    address: walletAddress,
    wallet,
    provider,
    transactionOverrides,
  }: ScriptRunEnvironment
) => {
  const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
  const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

  if (erc20DeploymentData) {
    const erc20list = Object.keys(erc20DeploymentData)
      .map((symbol) => ({
        symbol,
        address: erc20DeploymentData[symbol],
      }))

    const { tokenAddress } = await prompts({
        type: 'select',
        name: 'tokenAddress',
        message: 'Add Liquidity',
        choices: [
            ...(erc20list.map(({ address, symbol }) => ({
                value: address,
                title: `${address} (${symbol})`,
            }))),
            { value: 'all', title: 'all' }
        ],
    })

    switch(tokenAddress) {
      case 'all':
        await addLiquidityAllScript({
          admin: walletAddress,
          network: network,
          deployer: wallet,
          provider,
          transactionOverrides
        })
        break
      default: {
        await addLiquiditySingleScript(tokenAddress, poolName, network, wallet, transactionOverrides)
      }
    }   
  }
}

export default addLiquidityCli