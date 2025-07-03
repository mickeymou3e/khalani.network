import prompts from 'prompts';

import { balanceOfAll as balanceOfAllScript } from '../../../../scripts/godwoken/tokens/ERC20/batch.godwoken'
import { balanceOf as balanceOfScript } from '../../../../scripts/godwoken/tokens/ERC20/methods/balance'
import { ERC20_CONTRACTS_DIR } from '../../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../../../scripts/godwoken/tokens/ERC20/types';
import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../../types';
import { REGISTRY_CONTRACTS_DIR } from '../../../../scripts/godwoken/registry/constants';
import { RegistryDeploymentData } from '../../../../scripts/godwoken/registry/types';

import connect from '../../../../scripts/godwoken/registry/userBalances/connect'

export const batchBalanceCli = async (environment: ScriptRunEnvironment) => {
  const registryDeploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, environment.network)
  const registryDeploymentData = getData<RegistryDeploymentData>(registryDeploymentDataPath)   

  const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, environment.network)
  const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)


    if (registryDeploymentData && erc20DeploymentData) {
      const userBalancesAddress = registryDeploymentData.UserBalances

      const userBalances = await connect(userBalancesAddress, environment.wallet)

      const erc20list = Object.keys(erc20DeploymentData)
        .map((symbol) => ({
          symbol,
          address: erc20DeploymentData[symbol],
        }))

      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'Balance of(address)',
        initial: environment.address,
      })

      const { blockTagValue } = await prompts({
        type: 'text',
        name: 'blockTagValue',
        message: `Balance of(${address}, { blockTag })`,
        initial: 'latest',
      })
      
      let blockTag = 
        blockTagValue === 'latest' || blockTagValue === 'pending' 
        ? blockTagValue
        : Number(blockTagValue) 

      console.log('block tag', blockTag)

      const balances = await userBalances.balancesOf(address, erc20list.map(({ address }) => address), {
          ...environment.transactionOverrides,
          blockTag
      })

      for (let i = 0; i < balances.length; i++) {
        console.log(`[${erc20list[i].symbol}] ${balances[i]}`)
      }
    }
}
