import { constants, Overrides, Signer } from "ethers";
import connectERC20 from "../../../tokens/ERC20/connect";
import { packNumbers } from "../../../utils";

import { connectRegistry } from '../../connect'

export async function addPool(
    poolName: string,
    poolAddress: string,
    tokens: string[],
    lpTokenAddress: string,
    registryAddress: string,
    deployer: Signer,
    transactionOverrides: Overrides,
) {
    console.log(`[Registry][Registry] Address ${registryAddress}`)
    console.log(`[Registry][Registry] Add pool ${poolName}`)
    const registry = connectRegistry(registryAddress, deployer)

    const decimals = []
    for(const token of tokens) {
        const tokenContract = connectERC20(token, deployer)
        const tokenDecimals = await tokenContract.decimals()
        decimals.push(tokenDecimals.toNumber())
    }

    const packedDecimals = packNumbers(decimals)

    const registryAddPool = await registry.add_pool_without_underlying(
        poolAddress,
        tokens.length,
        lpTokenAddress,
        constants.HashZero,
        packedDecimals,
        packedDecimals,
        false,
        false,
        poolName,
        transactionOverrides
    )
    const receipt = await registryAddPool.wait()
    console.log(`[Registry][Registry] Added pool ${poolName}`)

    return receipt.transactionHash
}
