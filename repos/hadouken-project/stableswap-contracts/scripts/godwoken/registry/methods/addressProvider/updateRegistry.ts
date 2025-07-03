import { Overrides, Signer } from "ethers";

import { connectAddressProvider } from '../../connect'

export async function updateRegistries(
    addressProviderAddress: string,
    addresses: {
        registry?: string,
        poolInfo?: string,
        swaps?: string,
        factory?: string,
    },
    deployer: Signer,
    transactionOverrides: Overrides
) {
  const addressProvider = connectAddressProvider(addressProviderAddress, deployer)

  if (addresses.registry) {
    console.log('[Registry][AddressProvider] add Registy')
    const setRegistry = await addressProvider.set_address(
        0,
        addresses.registry,
        transactionOverrides
    )
    await setRegistry.wait()

    console.log('[Registry][AddressProvider] Registy added', addresses.registry)
  }

  let addressProviderMaxId

  if (addresses.poolInfo) {
    console.log('[Registry][AddressProvider] add Pool Info')
    addressProviderMaxId = await addressProvider.max_id()
    if (addressProviderMaxId.toNumber() === 0) {
        const addNewIdResult = await addressProvider.add_new_id(
            addresses.poolInfo,
            "PoolInfo Getters",
            transactionOverrides
        )
        await addNewIdResult.wait()
    } else {
        const setPoolInfo = await addressProvider.set_address(
            1,
            addresses.poolInfo,
            transactionOverrides
        )
        await setPoolInfo.wait()
    }
    console.log('[Registry][AddressProvider] Pool Info added', addresses.poolInfo)
  }

  if (addresses.swaps) {
    console.log('[Registry][AddressProvider] add Swaps')
    addressProviderMaxId = await addressProvider.max_id()
    if (addressProviderMaxId.toNumber() === 1) {
        const addNewIdResult = await addressProvider.add_new_id(
            addresses.swaps,
            "Exchanges",
            transactionOverrides
        )
        await addNewIdResult.wait()
    } else {
        const setSwap = await addressProvider.set_address(
            2,
            addresses.swaps,
            transactionOverrides
        )
        await setSwap.wait()
    }
    console.log('[Registry][AddressProvider] Swaps added', addresses.swaps)
  }

  if (addresses.factory) {
    console.log('[Registry][AddressProvider] add Factory')
    addressProviderMaxId = await addressProvider.max_id()
    if (addressProviderMaxId.toNumber() === 2) {
      const addNewIdResult = await addressProvider.add_new_id(
        addresses.factory,
        "Metapool Factory",
        transactionOverrides
      )
      await addNewIdResult.wait()
    } else {
      const setMetaFactory = await addressProvider.set_address(
          3,
          addresses.factory,
          transactionOverrides
      )
      await setMetaFactory.wait();
    }
    console.log('[Registry][AddressProvider] Factory added', addresses.factory)
  }
}