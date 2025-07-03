import { constants, Overrides, Signer } from "ethers";
import connectERC20 from "../../../tokens/ERC20/connect";
import { packNumbers } from "../../../utils";

import { connectRegistry } from '../../connect'

export async function getPools(
    registryAddress: string,
    deployer: Signer,
    transactionOverrides: Overrides,
) {
    const registry = connectRegistry(registryAddress, deployer)

    const poolCount = (await registry.pool_count()).toNumber()
    const pools: { address: string, name: string }[] = []
    for(let i = 0; i < poolCount; i++) {
      const poolAddress = await registry.pool_list(i, transactionOverrides)
      const poolName = await registry.get_pool_name(poolAddress, transactionOverrides)

      pools.push({ address: poolAddress, name: poolName })
    }

    return pools
}
