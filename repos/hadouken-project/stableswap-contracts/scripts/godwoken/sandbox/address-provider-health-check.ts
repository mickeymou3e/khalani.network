import { BigNumber, constants, ethers, Signer } from 'ethers'
import { Registry } from '../../../src/contracts/Registry'
import { deployer, transactionOverrides } from '../deployment.godwoken'
import { connectRegistry, packNumbers } from '../registry'
import Registries from '../../../contracts/registry/registrydata.godwoken.json'
import { prepare_contract_abi } from '../../../utils/prepare_contracts'
import AddressProviderJSON from '../../../build/contracts/AddressProvider.json'
import { AddressProvider } from '../../../src'

async function readRegistry() {
  const registryContract = connectRegistry(
    'godwoken.local.dev',
    deployer,
  ) as Registry
  console.log('Registry:', registryContract.address)

  const result = await registryContract.pool_count(transactionOverrides)
  console.log('Pool count:', result.toNumber())
}

async function addPoolManually() {
  const registryContract = connectRegistry(
    'godwoken.local.dev',
    deployer,
  ) as Registry
  console.log('Registry:', registryContract.address)

  const poolAddress = '0x36F2e1567f1a6dA96A0547d84BEE3257c91c19C4'
  const lpTokenAddress = '0xcf5c06Dc34996cE4e9094D08C9CB8de33E86D3Cb'

  try {
    const result = await registryContract.add_pool_without_underlying(
      poolAddress,
      BigNumber.from(3),
      lpTokenAddress,
      constants.HashZero,
      packNumbers([18, 6, 6]),
      packNumbers([18, 6, 6]),
      false,
      false,
      '3pool2',
      transactionOverrides
    )

    const receipt = await result.wait()
    console.log('Add Pool to Registry manually')
    console.log(JSON.stringify(receipt, null, 2))
  } catch(error) {
    console.log(JSON.stringify(error, null, 2))
  }
}

/**
 * Address Provider Health Check
 * 
 * Deployed address provider should have added addresses
 * of dependent Registries:
 *  Registry
 *  Pool Info
 *  Swaps
 *  Factory
 * 
 * Admin should be able manually update address provider
 */
async function healthCheckAddressProvider() {
  const addressProviderAddress = Registries.address_provider_address
  const addressProviderContract = new ethers.Contract(
    addressProviderAddress,
        JSON.stringify(prepare_contract_abi(AddressProviderJSON.abi)),
        deployer.provider
      ).connect(deployer) as AddressProvider;

  await isCheckExecutorIsAdmin(addressProviderContract, deployer)
  await areRegistriesInAddressProvider(addressProviderContract)
  await updateAddressProviderManually(addressProviderContract, Registries.registry_address)
}

async function isCheckExecutorIsAdmin(addressProviderContract: AddressProvider, deployer: Signer) {
  const addressProviderAdmin = await addressProviderContract.admin()

  const checkExecutorAddress = await deployer.getAddress()
  if(checkExecutorAddress !== addressProviderAdmin) {
    console.error('Executor is not Address Provider Admin')
  }
  console.log('admin:',addressProviderAdmin)
}

async function areRegistriesInAddressProvider(addressProviderContract: AddressProvider) {
  const addressProviderMaxId = await addressProviderContract.max_id()
  console.log('max_id:', addressProviderMaxId.toNumber())
}

async function updateAddressProviderManually(addressProviderContract: AddressProvider, registryAddress: string) {
  const addressProviderId = BigNumber.from(0)
  try {
    /* Update AddressProvider Registry manually with Registry address */
    const result = await addressProviderContract.set_address(
      addressProviderId,
      registryAddress,
      transactionOverrides
    )
    const receipt = await result.wait()
    console.log('address provider updated', receipt.transactionHash)

    const registryIdInfo = await addressProviderContract.get_id_info(addressProviderId, transactionOverrides)
    console.log('registry in address provider:', JSON.stringify(registryIdInfo, null, 2))
  } catch(error) {
    console.error(error)
  }

}

readRegistry()