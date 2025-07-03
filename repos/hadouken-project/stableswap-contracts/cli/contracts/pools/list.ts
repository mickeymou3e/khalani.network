import fs from 'fs'
import path from 'path'
import { POOLS_CONTRACTS_DIR } from '../../../scripts/godwoken/pools/constants';
import { PoolDeploymentData } from '../../../scripts/godwoken/pools/types';

import { REGISTRY_CONTRACTS_DIR } from '../../../scripts/godwoken/registry/constants';
import { getPools } from '../../../scripts/godwoken/registry/methods/registry/getPools';
import { Registry, RegistryDeploymentData } from '../../../scripts/godwoken/registry/types';

import { getData, getDeploymentDataPath } from '../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../types';

export const list = async ({ network, wallet, transactionOverrides }: ScriptRunEnvironment) => {
    const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR);

    if (poolsNames) {
      for (let poolName of poolsNames) {
          const poolContractPath = path.join(POOLS_CONTRACTS_DIR, poolName)
          const poolDeploymentDataPath = getDeploymentDataPath(poolContractPath, network)
          const poolDeploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)
          
        //   console.log(registryAddress, `(${registryName})`)
          
        //   if (registryName === Registry.Registry) {
        //       const pools = await getPools(registryAddress, wallet, transactionOverrides)
        //       pools.map(({ address, name }) => {
        //         console.log('\t', address, `(${name})`)
        //       })
        //   }
      }
    }
}