import React from 'react'
import { useDispatch } from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { screen } from '@testing-library/dom'
import { renderConnected } from '@tests/containers'

import { ChangeNetworkBanner } from './ChangeNetworkBanner.component'

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as typeof ReactRouterDom),
  useDispatch: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/zksync-testnet',
  }),
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
