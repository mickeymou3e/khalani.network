import React from 'react'
import { useDispatch } from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'

import { DeepPartial } from '@reduxjs/toolkit'
import { networkActions } from '@store/network/network.slice'
import { INetworkSliceState } from '@store/network/network.types'
import { fireEvent, screen } from '@testing-library/dom'
import { renderConnected } from '@tests/containers'

import SimpleContainer, { DATA_TESTID } from './SimpleContainer.component'

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as typeof ReactRouterDom),
  useDispatch: jest.fn(),
}))

const useDispatchMock = useDispatch as jest.Mock
const dispatchMock = jest.fn()

describe('SimpleContainer', () => {
  const networkInitialState: DeepPartial<INetworkSliceState> = {
    latestBlock: 666,
  }

  afterEach(() => {
    useDispatchMock.mockClear()
  })

  /**
   * Test is component rendered correctly, based on preloaded state
   */
  describe('component', () => {
    it('should render', () => {
      renderConnected(<SimpleContainer />, {
        initialState: {
          Network: networkInitialState,
        },
      })

      const buttonElement = screen.getByTestId(DATA_TESTID.button)
      expect(buttonElement).toBeVisible()

      const expectedLabelText = networkInitialState.latestBlock?.toString()
      const labelElement = screen.getByTestId(DATA_TESTID.label)

      if (!expectedLabelText) throw Error('text not found')
      expect(labelElement).toHaveTextContent(expectedLabelText)
    })
  })

  /**
   * Test is container triggers correct action's
   */
  describe('container', () => {
    beforeEach(() => {
      useDispatchMock.mockImplementation(() => dispatchMock)
    })

    afterEach(() => {
      useDispatchMock.mockClear()
    })

    it('dispatch action on button click', async () => {
      renderConnected(<SimpleContainer />, {
        initialState: {
          Network: networkInitialState,
        },
      })

      const button = screen.getByTestId(DATA_TESTID.button)
      fireEvent.click(button)

      expect(dispatchMock).toHaveBeenCalledWith(
        networkActions.updateLatestBlock(expect.any(Number)),
      )
    })
  })

  /**
   * Test is container changes store state correctly and
   * store changes are represented in container
   */
  describe('store', () => {
    beforeEach(() => {
      const { useDispatch: useDispatchActual } = jest.requireActual(
        'react-redux',
      )
      useDispatchMock.mockImplementation(useDispatchActual)
    })

    it('change store state with ui event', async () => {
      const [, store] = renderConnected(<SimpleContainer />, {
        initialState: {
          Network: networkInitialState,
        },
      })

      const button = screen.getByTestId(DATA_TESTID.button)
      fireEvent.click(button)

      const { latestBlock } = store.getState().Network

      expect(latestBlock).toBe(777)
    })

    it('externally triggered action change container presentation', async () => {
      const [renderedContainer, store] = renderConnected(<SimpleContainer />, {
        initialState: {
          Network: networkInitialState,
        },
      })
      const newLatestBlock = 100

      store.dispatch(networkActions.updateLatestBlock(newLatestBlock))

      const { latestBlock } = store.getState().Network

      expect(latestBlock).toBe(newLatestBlock)

      renderedContainer.rerender(<SimpleContainer />)

      const expectedText = newLatestBlock.toString()
      const textElement = screen.getByTestId(DATA_TESTID.text)

      expect(textElement).toHaveTextContent(expectedText)
    })
  })
})
