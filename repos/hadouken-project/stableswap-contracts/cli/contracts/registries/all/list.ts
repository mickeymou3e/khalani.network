import { REGISTRY_CONTRACTS_DIR } from '../../../../scripts/godwoken/registry/constants';
import { getPools } from '../../../../scripts/godwoken/registry/methods/registry/getPools';
import { Registry, RegistryDeploymentData } from '../../../../scripts/godwoken/registry/types';

import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../../types';

export const list = async ({ network, wallet, transactionOverrides }: ScriptRunEnvironment) => {
    const registriesDeploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
    const registriesDeploymentData = getData<RegistryDeploymentData>(registriesDeploymentDataPath)

    if (registriesDeploymentData) {
      for (let [registryName, registryAddress] of Object.entries(registriesDeploymentData)) {
          console.log(registryAddress, `(${registryName})`)

          if(registryName === Registry.Registry) {
              await getPools(registryAddress, wallet, transactionOverrides)
          }
      }
    }
}