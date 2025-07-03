import { Contract } from 'ethers-v6'

import config from '@config'
import { providerSelector } from '@store/provider/provider.selector'
import { createSelector } from '@reduxjs/toolkit'
import { LIB_ENCODE_ABI } from '@artifacts/LibEncodeArtifact'
import { INTENTBOOK_ABI } from '@artifacts/IntentBookArtifact'
import { MTOKEN_REGISTRY_ABI } from '@artifacts/MTokenRegistry'
import { MTOKEN_ABI } from '@artifacts/MTokenArtifact'
import { MTOKEN_MANAGER_ABI } from '@artifacts/MTokenManagerArtifact'

const libEncode = createSelector(
  [providerSelector.balancerChainProvider],
  (signer) =>
    signer
      ? new Contract(config.contracts.LibEncode, LIB_ENCODE_ABI, signer)
      : null,
)

const tokenConnector = createSelector(
  [providerSelector.customArcadiaChainProvider],
  (provider) => (tokenAddress: string) =>
    provider
      ? new Contract(
          tokenAddress,
          ['function balanceOf(address owner) view returns (uint256)'],
          provider,
        )
      : null,
)

const intentBook = createSelector(
  [providerSelector.balancerChainProvider],
  (signer) =>
    signer
      ? new Contract(config.contracts.IntentBook, INTENTBOOK_ABI, signer)
      : null,
)

const receiptManager = createSelector(
  [providerSelector.khalaniSigner],
  (signer) =>
    signer
      ? new Contract(config.contracts.ReceiptManager, INTENTBOOK_ABI, signer)
      : null,
)

const mToken = createSelector([providerSelector.khalaniSigner], (signer) =>
  signer
    ? new Contract(
        '0x5065EbB5402075693d009cF275DcD93B0eA399b5',
        MTOKEN_ABI,
        signer,
      )
    : null,
)

const mTokenManager = createSelector(
  [providerSelector.khalaniSigner],
  (signer) =>
    signer
      ? new Contract(config.contracts.MTokenManager, MTOKEN_MANAGER_ABI, signer)
      : null,
)

const mTokenManagerCall = createSelector([providerSelector.signer], (signer) =>
  signer
    ? new Contract(config.contracts.MTokenManager, MTOKEN_MANAGER_ABI, signer)
    : null,
)

const mTokenRegistry = createSelector(
  [providerSelector.khalaniSigner],
  (signer) =>
    signer
      ? new Contract(
          config.contracts.MTokenRegistry,
          MTOKEN_REGISTRY_ABI,
          signer,
        )
      : null,
)

export const khalaniContractsSelectors = {
  libEncode,
  tokenConnector,
  intentBook,
  mTokenRegistry,
  mToken,
  mTokenManager,
  mTokenManagerCall,
}
