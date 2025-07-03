import { ERC20_CONTRACTS_DIR } from '../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../../scripts/godwoken/tokens/ERC20/types';
import { getData, getDeploymentDataPath } from '../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../types';

export const list = async ({ network }: ScriptRunEnvironment) => {
    const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const erc20DeploymentData = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

    if (erc20DeploymentData) {
      Object.keys(erc20DeploymentData).map(erc20Symbol => {
          const erc20Address = erc20DeploymentData[erc20Symbol]
          console.log(erc20Address, `(${erc20Symbol})`)
      })
    }
}