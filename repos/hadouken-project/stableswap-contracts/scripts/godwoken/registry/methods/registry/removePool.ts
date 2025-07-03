import { constants, Overrides, Signer } from "ethers";
import connectERC20 from "../../../tokens/ERC20/connect";
import { packNumbers } from "../../../utils";

import { connectRegistry } from '../../connect'

export async function removePool(
    poolAddress: string,
    registryAddress: string,
    deployer: Signer,
    transactionOverrides: Overrides,
) {
    const registry = connectRegistry(registryAddress, deployer)

    const removePool = await registry.remove_pool(poolAddress, transactionOverrides)
    const receipt = await await removePool.wait()


    return receipt.transactionHash
}
