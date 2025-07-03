import { Environments } from '@hadouken-project/lending-contracts'

import { testIds } from '../../../src/utils/tests'

export const godwokenTestnetNetwork = {
  networkName: 'Godwoken-testnet-v1',
  rpcUrl: 'https://godwoken-testnet-web3-v1-rpc.ckbapp.dev/',
  chainId: '0x315db00000006',
  symbol: 'CKB',
  blockExplorer: 'https://explorer.nervos.org/aggron/address/',
  isTestnet: true,
}

export const godwokenLocalNetwork = {
  networkName: 'Godwoken-localhost',
  rpcUrl: 'http://localhost:8024/',
  chainId: '0x116e8',
  symbol: 'CKB',
  blockExplorer: 'https://explorer.nervos.org/aggron/address/',
  isTestnet: true,
}

export const DEFAULT_ACCOUNT =
  '0x951e4f41b38d2171bd51e83bd5bb652cc91e701a2611dbae8ee2f7c000a76a19'

// Need to create L2 account + deposit lot of ADA tokens to this address
export const DEPOSIT_TEST_ACCOUNT =
  '0x22421803ba4fd7e142f7dac5aa81ae935f3dda12973793e306a1f91dbf9906cb'

// Need to create L2 account + withdraw lot of BNB tokens to this address
export const WITHDRAW_TEST_ACCOUNT =
  '0x645318db4c7adf75de228f8f7553a8ba531318d74995a1ed0d9a45d01e117df3'

export const TIMEOUT = 150000

export const setupAccount = (privateKey: string, env: Environments): void => {
  if (env === 'testnet') {
    cy.setupMetamask(privateKey, godwokenTestnetNetwork, '12345678')
  } else {
    cy.setupMetamask(privateKey, godwokenLocalNetwork, '12345678')
  }

  cy.importMetamaskAccount(privateKey)
}

export const connectToAccount = (): void => {
  cy.get(`[data-testid=${testIds.CONNECT_METAMASK}]`).click()

  cy.acceptMetamaskAccess({ allAccounts: false }).then((connected) => {
    expect(connected).to.be.true
  })
}
