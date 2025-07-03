import prompts from 'prompts';

import { balanceOfAll as balanceOfAllScript } from '../../../scripts/godwoken/tokens/ERC20/batch.godwoken'
import { balanceOf as balanceOfScript } from '../../../scripts/godwoken/tokens/ERC20/methods/balance'
import { ERC20_CONTRACTS_DIR } from '../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../../scripts/godwoken/tokens/ERC20/types';
import { getData, getDeploymentDataPath } from '../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../types';

export const balanceCli = async (environment: ScriptRunEnvironment) => {
    const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, environment.network)
    const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

    if (erc20DeploymentData) {
      const erc20list = Object.keys(erc20DeploymentData)
        .map((symbol) => ({
          symbol,
          address: erc20DeploymentData[symbol],
        }))

      const { symbol } = await prompts({
          type: 'select',
          name: 'symbol',
          message: 'Balance',
          choices: [
              ...(erc20list.map(({ address, symbol }) => ({
                  value: symbol,
                  title: `${address} (${symbol})`,
              }))),
              { value: 'all', title: 'all' }
          ],
      });

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
      await balanceHandler(
        symbol,
        address,
        { ...environment,
          transactionOverrides: {
            ...environment.transactionOverrides,
            blockTag
          }
        }
      )
    }
}

export const balanceHandler = async (tokenSymbol: string, address: string, {
  network,
  provider,
  wallet,
  transactionOverrides,
}: ScriptRunEnvironment) => {
  const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
  const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

  if (erc20DeploymentData) {
    switch(tokenSymbol) {
      case 'all': {
        const balances = await balanceOfAllScript({
            network,
            provider,
            address,
            wallet,
            transactionOverrides,
        })
  
        balances && Object.keys(balances).forEach(tokenSymbol => {
            const balance = balances && balances[tokenSymbol]
            console.log(balance.toString(), `(${tokenSymbol})`)
        })
        break;
      }
      default: {
        const tokenAddress = erc20DeploymentData[tokenSymbol]
        const balance = await balanceOfScript(
            address,
            tokenAddress,
            wallet,
            transactionOverrides,
        )
  
        console.log(balance.toString(), `(${tokenSymbol})`)
  
        break;
      }
    }
  }
}
