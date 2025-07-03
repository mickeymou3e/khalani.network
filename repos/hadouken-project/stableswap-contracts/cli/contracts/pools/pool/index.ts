import prompts from 'prompts';
import path from 'path';
import fs from 'fs';

import { ScriptRunEnvironment } from '../../../types';

import { deploy } from './deploy'
import addLiquidityCli from './addLiquidity';
import { transferOwnership } from './transferOwnership'
import { balanceCli, balanceHandler } from '../../tokens/balance';
import { getPoolContractName } from '../../../../scripts/godwoken/pools/utils';
import { POOLS_CONTRACTS_DIR } from '../../../../scripts/godwoken/pools/constants';
import { getData, getDataPath, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';
import { PoolData, PoolDeploymentData } from '../../../../scripts/godwoken/pools/types';

import { PoolCli } from './types';
import { getVirtualPrice } from '../../../../scripts/godwoken/pools/methods/getVirtualPrice';

const poolCli: PoolCli = async ({poolName, environment, parentCli }) => {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'list', value: 'list' },
          { title: 'deploy', value: 'deploy' },
          { title: 'transfer ownership', value: 'transfer-ownership' },
          { title: 'add liquidity', value: 'add-liquidity' },
          { title: 'balance', value: 'balance' },
          { title: 'get virtual price', value: 'get-virtual-price' },
        ],
    }, {
        onCancel: () => {
            return parentCli ? parentCli({ environment }) : process.exit(0)
        }
    });

    switch(action) {
        case 'list':
            console.log('NOT IMPLEMENTED YET')
            break;
        case 'deploy':
            await deploy(poolName, environment)
            break;
        case 'add-liquidity':
            await addLiquidityCli(poolName, environment)
            break;
        case 'balance': {
            if (poolName === 'all') {
                const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR);
                for(let poolName of poolsNames) {
                    const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
                    const poolDataPath = getDataPath(poolContractDir)
                    const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, environment.network)
                  
                    const data = getData<PoolData>(poolDataPath)
                    const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)
                    const poolContractName = getPoolContractName(poolName)
        
                    const poolAddress = deploymentData && deploymentData[poolContractName]
        
                    if (data && poolAddress) {
                        console.log(poolAddress, `(${poolName})`)
                        for (let tokenSymbol of data.tokens) {
                            await balanceHandler(tokenSymbol, environment.address, { ...environment, address: poolAddress })
                        }
                    }
                }
            } else {
                const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
                const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, environment.network)
              
                const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)
                const poolContractName = getPoolContractName(poolName)
    
                const poolAddress = deploymentData && deploymentData[poolContractName]
    
                if (poolAddress) {
                    await balanceCli({ ...environment, address: poolAddress })
                }
            }
            break;
        }
        case 'get-virtual-price': {
            if (poolName === 'all') {
                const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR);
                for(let poolName of poolsNames) {
                    const virtual_price = await getVirtualPrice(
                        poolName,
                        environment.network,
                        environment.wallet,
                        environment.transactionOverrides
                    )

                    console.log(`${poolName} virtual price: ${virtual_price?.toString()}`)
                }
            } else {
                const virtual_price = await getVirtualPrice(
                    poolName,
                    environment.network,
                    environment.wallet,
                    environment.transactionOverrides
                )

                console.log(`${poolName} virtual price: ${virtual_price?.toString()}`)
            }
            break
        }
        case 'transfer-ownership':
            await transferOwnership(poolName, environment)
            break;
        default:
            break;
    }


    return poolCli({ poolName, environment, parentCli })
};

export default poolCli
