import prompts from 'prompts';

import { REGISTRY_CONTRACTS_DIR } from '../../../../scripts/godwoken/registry/constants';
import { RegistryDeploymentData } from '../../../../scripts/godwoken/registry/types';

import { getPools as getPoolsScript } from '../../../../scripts/godwoken/registry/methods/registry/getPools'

import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';

import { CliPropsExtended, CliProvider } from '../../../types';
import { constants } from 'ethers';


export const slectPoolsCli: CliProvider<CliPropsExtended<{ message: string}>, string> = async ({ message, ...props }): Promise<string> => {
    const { environment } = props

    const registryDeploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, environment.network)
    const registryDeploymentData = getData<RegistryDeploymentData>(registryDeploymentDataPath)

    if (registryDeploymentData) {
        const registryAddress = registryDeploymentData.Registry

        const pools = await getPoolsScript(registryAddress, environment.wallet, environment.transactionOverrides)

        const { address: poolAddress } = await prompts({
            type: 'select',
            name: 'address',
            message: message,
            choices: [
            ...(pools.map(({ name, address }) => ({
                value: address,
                title: `${address} (${name})`,
            })))
            ],
        })

        return poolAddress
    }
    
    return constants.AddressZero
}