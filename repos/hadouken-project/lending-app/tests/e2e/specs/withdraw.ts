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
  getProvider,
} from '@hadouken-project/lending-contracts'

import { testIds } from '../../../src/utils/tests'
import {
  TIMEOUT,
  WITHDRAW_TEST_ACCOUNT,
  connectToAccount,
  setupAccount,
} from '../utils/setup'

describe('Withdraw assets', () => {
  it(`Withdraw BNB token happy path`, () => {
    const environment = Cypress.env('environment') as Environments
    const config = getConfigFromNetworkName('godwoken-testnet')

    const BNBToken = config.tokens.find(
      (token: { symbol: string }) => token.symbol === 'bnb',
    )
    const getProviderByEnv = getProvider(config.chainId)
    const provider = getProviderByEnv(environment, true)
    const connect = getConnect(config.chainId)

    const wallet = new ethers.Wallet(WITHDRAW_TEST_ACCOUNT, provider)

    setupAccount(WITHDRAW_TEST_ACCOUNT, environment)

    cy.visit('/')

    connectToAccount()

    cy.get('header').findByText('Dashboard').click()

    cy.url().should('include', '/dashboard')

    cy.get(`[data-testid=withdraw-${BNBToken.address.toLowerCase()}]`)
      .first()
      .click()

    cy.url().should('include', '/withdraw/BNB')

    cy.get('input').type('10.00')

    cy.findByTestId(testIds.WITHDRAW_BUTTON).click()

    const connections = connect(wallet.provider, environment)

    const BNBTokenConnection = connections.token(BNBToken.address)

    const amountToWithdraw = BigNumber.from(1000000000)

    cy.wrap(null)
      .then(() => BNBTokenConnection.balanceOf(wallet.address))
      .then((valuesBefore) => {
        cy.wrap(null).then(() => {
          cy.confirmMetamaskTransaction({
            gasFee: 0.000000001,
            gasLimit: 1500000,
          })

          cy.get('.MuiCircularProgress-root', { timeout: TIMEOUT }).should(
            'not.exist',
          )

          cy.wrap(null)
            .then(() => BNBTokenConnection.balanceOf(wallet.address))
            .then((valueAfter) => {
              expect(valueAfter.sub(valuesBefore).eq(amountToWithdraw))
            })
        })
      })

    expect(true)
  })
})
