// import React from 'react'
// import { useDispatch } from 'react-redux'
// import * as ReactRouterDom from 'react-router-dom'

// import { walletActions } from '@store/wallet/wallet.slice'
// import { ConnectionPhase, ConnectionStatus } from '@store/wallet/wallet.types'
// import { fireEvent, screen } from '@testing-library/dom'
// import { renderConnected } from '@tests/containers'

// import { CreateNervosAccountBanner } from './CreateNervosAccountBanner.component'

// jest.mock('react-redux', () => ({
//   ...(jest.requireActual('react-redux') as typeof ReactRouterDom),
//   useDispatch: jest.fn(),
// }))

// const useDispatchMock = useDispatch as jest.Mock
// const dispatchMock = jest.fn()

describe('container', () => {
  // TODO: rewrite tests
  //   beforeEach(() => {
  //     useDispatchMock.mockImplementation(() => dispatchMock)
  //   })
  //   afterEach(() => {
  //     useDispatchMock.mockClear()
  //   })
  //   it('renders modal correctly', async () => {
  //     renderConnected(<CreateNervosAccountBanner />, {
  //       initialState: {
  //         Wallet: {
  //           ckbAddress: 'ckb123',
  //           connectionPhase: ConnectionPhase.Layer2Creation,
  //           connectionStatus: ConnectionStatus.fail,
  //         },
  //       },
  //     })
  //     const dismissButton = screen.queryByTestId(
  //       'createNervosAccountModal-dismissButton',
  //     )
  //     const createL2AccountButton = screen.queryByTestId('createL2Banner-button')
  //     const modal = screen.queryByTestId('createNervosAccountModal')
  //     fireEvent.click(dismissButton)
  //     expect(modal).not.toBeVisible()
  //     fireEvent.click(createL2AccountButton)
  //     expect(modal).toBeVisible()
  //   })
  // })
  // it('does not render on connected state', async () => {
  //   renderConnected(<CreateNervosAccountBanner />, {
  //     initialState: {
  //       Wallet: {
  //         ckbAddress: 'ckb123',
  //         connectionPhase: ConnectionPhase.Connected,
  //       },
  //     },
  //   })
  //   const errorLabel = screen.queryByTestId('createL2Banner-errorLabel')
  //   expect(errorLabel).toBeNull()
  // })
  // it('does not render on success status', async () => {
  //   renderConnected(<CreateNervosAccountBanner />, {
  //     initialState: {
  //       Wallet: {
  //         ckbAddress: 'ckb123',
  //         connectionPhase: ConnectionPhase.Layer2Creation,
  //         connectionStatus: ConnectionStatus.success,
  //       },
  //     },
  //   })
  //   const errorLabel = screen.queryByTestId('createL2Banner-errorLabel')
  //   expect(errorLabel).toBeNull()
  // })
  // it('dispatch action on button click', async () => {
  //   renderConnected(<CreateNervosAccountBanner />, {
  //     initialState: {
  //       Wallet: {
  //         ckbAddress: 'ckb123',
  //         connectionPhase: ConnectionPhase.Layer2Creation,
  //         connectionStatus: ConnectionStatus.fail,
  //       },
  //     },
  //   })
  //   const createAccButton = screen.queryByTestId(
  //     'createNervosAccountModal-createButton',
  //   )
  //   fireEvent.click(createAccButton)
  //   expect(dispatchMock).toHaveBeenCalledWith(
  //     walletActions.createNervosLayer2AccountRequest(),
  //   )
})
