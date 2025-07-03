/* eslint-disable testing-library/await-async-utils */

/* eslint-disable ui-testing/no-hard-wait */

/* eslint-disable cypress/no-unnecessary-waiting */

/* eslint-disable cypress/no-assigning-return-values */

/* eslint-disable testing-library/await-async-query */

/* eslint-disable testing-library/prefer-screen-queries */
import { BigNumber, ethers } from 'ethers'

import {
  Environments,
  getConfigFromNetworkName,
  getConnect,
  getContractsConfigFromNetworkName,
  getProvider,
} from '@hadouken-project/lending-contracts'

import { testIds } from '../../../src/utils/tests'
import {
  connectToAccount,
  DEPOSIT_TEST_ACCOUNT,
  setupAccount,
  TIMEOUT,
} from '../utils/setup'

describe('Deposit assets', () => {
  it(`Deposit ADA token happy path`, () => {
    const environment = Cypress.env('environment') as Environments
    const config = getConfigFromNetworkName('godwoken-testnet')
    const contractsConfig = getContractsConfigFromNetworkName(
      'godwoken-testnet',
    )
    const adaToken = config.tokens.find((x) => x.symbol === 'ada')
    const getProviderByEnv = getProvider(config.chainId)
    const provider = getProviderByEnv(environment, true)
    const wallet = new ethers.Wallet(DEPOSIT_TEST_ACCOUNT, provider)
    const connect = getConnect(config.chainId)

    setupAccount(DEPOSIT_TEST_ACCOUNT, environment)

    cy.visit('/')

    connectToAccount()

    cy.get('header').findByText('Deposit').click()

    cy.url().should('include', '/deposit')

    cy.findByTestId(adaToken.address.toLowerCase()).click()

    cy.url().should('include', '/deposit/ADA')

    cy.get('input').type('10.50')

    cy.findByTestId(testIds.DEPOSIT_BUTTON).click()

    const connections = connect(wallet.provider, environment)

    const adaTokenConnection = connections.token(adaToken.address)

    const amountToDeposit = BigNumber.from(10500000)

    cy.wrap(null)
      .then(() => adaTokenConnection.balanceOf(wallet.address))
      .then((valuesBefore) => {
        cy.wrap(null)
          .then(() =>
            adaTokenConnection.allowance(
              wallet.address,
              contractsConfig.lendingPoolProxy,
            ),
          )
          .then((value) => {
            // 10.50 for user
            if (value < amountToDeposit) {
              cy.confirmMetamaskPermissionToSpend()
              // TODO
              cy.wait(80000)
              // cy.waitUntil(
              //   () => {
              //     return // Find some way to wait
              //   },
              //   { timeout: TIMEOUT },
              // )
            }

            cy.confirmMetamaskTransaction({
              gasFee: 0.000000001,
              gasLimit: 1500000,
            })

            cy.get('.MuiCircularProgress-root', { timeout: TIMEOUT }).should(
              'not.exist',
            )

            cy.wrap(null)
              .then(() => adaTokenConnection.balanceOf(wallet.address))
              .then((valueAfter) => {
                expect(valuesBefore.sub(valueAfter).eq(amountToDeposit))
              })
          })
      })

    expect(true)
  })
})
