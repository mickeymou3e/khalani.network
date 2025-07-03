import prompts from 'prompts'
import { constants } from 'ethers'
import { ERC20_CONTRACTS_DIR } from '../../../scripts/godwoken/tokens/ERC20/constants'
import { ERC20DeploymentData } from '../../../scripts/godwoken/tokens/ERC20/types'
import { getData, getDeploymentDataPath } from '../../../scripts/godwoken/utils'

import { CliProvider, CliPropsExtended, ScriptRunEnvironment } from '../../types'

export const selectTokenCli: CliProvider<CliPropsExtended<{ message: string}>, string> = async ({ message, ...props }): Promise<string> => {
  const { environment } = props

  const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, environment.network)
  const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

  if (erc20DeploymentData) {
    const erc20list = Object.keys(erc20DeploymentData)
      .map((symbol) => ({
        symbol,
        address: erc20DeploymentData[symbol],
      }))

    const { address } = await prompts({
        type: 'select',
        name: 'address',
        message,
        choices: [
          ...(erc20list.map(({ address, symbol }) => ({
              value: address,
              title: `${address} (${symbol})`,
          })))
        ],
    });

    return address as unknown as string
  }

  return constants.AddressZero
}