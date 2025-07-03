import config from '@config'
import { providerSelector } from '@store/provider/provider.selector'
import { createSelector } from '@reduxjs/toolkit'
import { Contract } from 'ethers-v6'
import { ASSET_RESERVES_ABI } from '@artifacts/AssetReservesArtifact'

const crossChainTokenConnector = createSelector(
  [providerSelector.signer],
  (signer) => (tokenAddress: string) =>
    signer
      ? new Contract(
          tokenAddress,
          ['function balanceOf(address owner) view returns (uint256)'],
          signer,
        )
      : null,
)

const assetReservesAddress = createSelector(
  [providerSelector.network],
  (network) =>
    network
      ? (
          config.contracts.AssetReserves as {
            [key: string]: string | undefined
          }
        )[network]
      : null,
)

const assetReserves = createSelector(
  [assetReservesAddress, providerSelector.signer],
  (address, signer) =>
    address && signer
      ? new Contract(address, ASSET_RESERVES_ABI, signer)
      : null,
)

const diamondProxyAddress = createSelector(
  [providerSelector.network],
  (network) =>
    network
      ? (
          config.contracts.DiamondProxy as {
            [key: string]: string | undefined
          }
        )[network]
      : null,
)

const permit2Address = createSelector([providerSelector.network], (network) =>
  network
    ? (
        config.contracts.permit2 as {
          [key: string]: string | undefined
        }
      )[network]
    : null,
)

export const evmChainContractsSelectors = {
  crossChainTokenConnector,
  diamondProxyAddress,
  assetReserves,
  assetReservesAddress,
  permit2Address,
}

/**
 * @deprecated use `evmChainContractsSelectors` to explicitly know that they apply only to EVM end chains.
 */
export const contractsSelectors = evmChainContractsSelectors
