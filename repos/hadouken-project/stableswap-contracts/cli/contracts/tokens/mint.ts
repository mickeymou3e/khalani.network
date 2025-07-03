import prompts from 'prompts';

import { mintAll as mintAllScript } from '../../../scripts/godwoken/tokens/ERC20/batch.godwoken'
import { mint as mintScript } from '../../../scripts/godwoken/tokens/ERC20/methods/mint'
import { ERC20_CONTRACTS_DIR } from '../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../../scripts/godwoken/tokens/ERC20/types';
import { getData, getDeploymentDataPath } from '../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../types';

export const mintCli = async ({
    network,
    address: walletAddress,
    provider,
    wallet,
    transactionOverrides,
}: ScriptRunEnvironment) => {
    const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

    if (erc20DeploymentData) {
      const erc20Indexed = Object.keys(erc20DeploymentData)
        .map((symbol, index) => ({
          symbol,
          address: erc20DeploymentData[symbol],
          index
        }))

      const { index } = await prompts({
          type: 'select',
          name: 'index',
          message: 'Select deploy',
          choices: [
              ...(erc20Indexed.map(({ index, ...erc20 }) => ({
                  value: index,
                  title: `${erc20.address} (${erc20.symbol})`,
              }))),
              { value: 'all', title: 'all' }
          ],
      });


    switch(index) {
      case 'all':
          await mintAllScript({
            network,
            provider,
            admin: walletAddress,
            deployer: wallet,
            transactionOverrides,
          })
          break;
      default:
          const { symbol, address } = erc20Indexed[index]
          await mintScript(
            symbol,
            address,
            walletAddress,
            wallet,
            transactionOverrides,
          )
          break;
    }
  }
}