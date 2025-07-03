import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { connectSwaps, connectRegistry } from "../../../registry/connect";
import { REGISTRY_CONTRACTS_DIR } from "../../../registry/constants";
import { RegistryDeploymentData } from "../../../registry/types";
import { getData, getDeploymentDataPath } from "../../../utils";
import { Config, runHealthCheck } from "../run";

async function healthCheck({ network, deployer }: Config) {
    const deploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
    const deploymentData = getData<RegistryDeploymentData>(deploymentDataPath)
    if (deploymentData) {
        const swapsAddress = deploymentData.Swaps
        const registryAddress = deploymentData.Registry

        console.log('swapsAddress', swapsAddress)
        const swaps = connectSwaps(swapsAddress, deployer)
        const registry = connectRegistry(registryAddress, deployer)
    
        const poolsCount = await registry.pool_count()
        console.log('pools count', poolsCount.toString())
        for (let poolIndex = 0; poolIndex < poolsCount.toNumber(); poolIndex++) {
            const pool = await registry.pool_list(poolIndex)
            console.log('pool', pool)
        }


        const findPool = await registry["find_pool_for_coins(address,address)"](
            "0x0815b0d4e58c8e707a85e774c37cab65480f66e9",
            "0xc03da4356b4030f0ec2494c18dcfa426574e10d5",
        )

        console.log('found pool', findPool)
        const bestRate = await swaps["get_best_rate(address,address,uint256)"](
            "0x0815b0d4e58c8e707a85e774c37cab65480f66e9",
            "0xc03da4356b4030f0ec2494c18dcfa426574e10d5",
            BigNumber.from("100000000000")
        )
    
        console.log(bestRate.toString())
    }
}


runHealthCheck(healthCheck)