import React from 'react'
import { useDispatch } from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletActions } from '@store/wallet/wallet.slice'
import { fireEvent, screen } from '@testing-library/dom'
import { renderConnected } from '@tests/containers'

import { ChangeNetworkBanner } from './ChangeNetworkBanner.component'

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as typeof ReactRouterDom),
  useDispatch: jest.fn(),
}))

const useDispatchMock = useDispatch as jest.Mock
const dispatchMock = jest.fn()

describe('container', () => {
  beforeEach(() => {
    useDispatchMock.mockImplementation(() => dispatchMock)
  })

  afterEach(() => {
    useDispatchMock.mockClear()
  })

  it('renders modal correctly', async () => {
    renderConnected(<ChangeNetworkBanner />, {
      initialState: {
        Wallet: {
          connectionStage: {
            type: ConnectionStageType.ChangeNetwork,
            status: ConnectionStageStatus.Fail,
          },
        },
      },
    })

    const dismissButton = screen.queryByTestId(
      'changeWalletNetworkModal-dismissButton',
    )
    const changeNetworkButton = screen.queryByTestId(
      'changeNetworkBanner-button',
    )
    const modal = screen.queryByTestId('changeWalletNetworkModal')

    if (!dismissButton) throw Error('dismiss button missing')

    fireEvent.click(dismissButton)

    expect(modal).not.toBeVisible()

    if (!changeNetworkButton) throw Error('change networkButton button missing')

    fireEvent.click(changeNetworkButton)

    expect(modal).toBeVisible()
  })
})

it('does not render on connected state', async () => {
  renderConnected(<ChangeNetworkBanner />, {
    initialState: {
      Wallet: {
        connectionStage: {
          type: ConnectionStageType.Connected,
          status: ConnectionStageStatus.Success,
        },
      },
    },
  })

  const errorLabel = screen.queryByTestId('changeNetworkBanner-errorLabel')

  expect(errorLabel).toBeNull()
})

it('does not render on success status', async () => {
  renderConnected(<ChangeNetworkBanner />, {
    initialState: {
      Wallet: {
        connectionStage: {
          type: ConnectionStageType.ChangeNetwork,
          status: ConnectionStageStatus.Success,
        },
      },
    },
  })

  const errorLabel = screen.queryByTestId('changeWalletNetworkModal-errorLabel')

  expect(errorLabel).toBeNull()
})

it('dispatch action on button click', async () => {
  renderConnected(<ChangeNetworkBanner />, {
    initialState: {
      Wallet: {
        connectionStage: {
          type: ConnectionStageType.ChangeNetwork,
          status: ConnectionStageStatus.Fail,
        },
      },
    },
  })

  const changeNetworkButton = screen.queryByTestId(
    'changeWalletNetworkModal-changeButton',
  )

  if (!changeNetworkButton) throw Error('change networkButton button missing')

  fireEvent.click(changeNetworkButton)

  expect(dispatchMock).toHaveBeenCalledWith(
    walletActions.switchMetamaskNetwork(),
  )
})
