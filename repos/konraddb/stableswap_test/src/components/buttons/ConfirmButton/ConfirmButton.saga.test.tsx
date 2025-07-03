import React from 'react'
import { useDispatch } from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

import { BigNumber } from 'ethers'

import { Network } from '@constants/Networks'
import { networkActions } from '@store/network/network.slice'
import { fireEvent, screen } from '@testing-library/dom'
import { renderConnected } from '@tests/containers'

import ConfirmButton from './ConfirmButton.component'

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as typeof ReactRouterDom),
  useDispatch: jest.fn(),
}))

const useDispatchMock = useDispatch as jest.Mock
const dispatchMock = jest.fn()

describe('ConfirmButton component', () => {
  beforeEach(() => {
    useDispatchMock.mockImplementation(() => dispatchMock)
  })

  afterEach(() => {
    useDispatchMock.mockClear()
  })

  it('should show change network button and update expected network', async () => {
    const fn = dispatchMock
    const text = 'Add'
    const disabled = false
    const expectedChainId = Network.Goerli

    renderConnected(
      <ConfirmButton
        onClick={fn}
        text={text}
        disabled={disabled}
        expectedChainId={expectedChainId}
      />,
      {
        initialState: {
          Network: {
            network: Network.Axon,
          },
        },
      },
    )

    const button = screen.getByRole('button')

    expect(button.textContent).toBe('Change network')

    fireEvent.click(button)

    expect(dispatchMock).toHaveBeenCalledWith(
      networkActions.updateExpectedNetwork(expectedChainId),
    )
  })

  it('should show add button', async () => {
    const fn = jest.fn()
    const text = 'Add'
    const disabled = false
    const expectedChainId = Network.Goerli

    renderConnected(
      <ConfirmButton
        onClick={fn}
        text={text}
        disabled={disabled}
        expectedChainId={expectedChainId}
      />,
      {
        initialState: {
          Network: {
            network: Network.Goerli,
          },
        },
      },
    )

    const button = screen.getByRole('button')

    expect(button.textContent).toBe('Add')
  })

  it('should show approve button', async () => {
    const fn = jest.fn()
    const text = ''
    const disabled = false
    const expectedChainId = Network.Goerli
    const tokenAddress = '0x0afz'
    const amount = BigNumber.from(5)
    const symbol = 'USDC'

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => React.useState(true))

    renderConnected(
      <ConfirmButton
        onClick={fn}
        text={text}
        disabled={disabled}
        expectedChainId={expectedChainId}
        tokensWithAmount={[{ address: tokenAddress, symbol, amount }]}
      />,
      {
        initialState: {
          Network: {
            network: Network.Goerli,
          },
          Allowance: {
            allowances: [
              {
                tokenAddress: '0x0afz',
                balance: BigNumber.from(4),
              },
            ],
          },
        },
      },
    )

    const button = screen.getByRole('button')

    expect(button.textContent).toBe('Approve')
  })
})
