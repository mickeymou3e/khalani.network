import { Overrides, Signer } from "ethers";

import { connectAddressProvider } from '../../connect'

export async function transferOwnership(
    addressProviderAddress: string,
    newAdmin: string,
    deployer: Signer,
    transactionOverrides: Overrides,
) {
    console.log(`[Registry][AddressRegistry]Transfer Ownership`)
    const addressProvider = connectAddressProvider(addressProviderAddress, deployer)
    
    const commitTransferOwnershipt = await addressProvider.commit_transfer_ownership(newAdmin, transactionOverrides)
    const receipt = await commitTransferOwnershipt.wait()

    console.log(`[Registry][AddressRegistry] Ownership Transfered`)
    
    return receipt.transactionHash
}
