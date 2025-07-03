import React from 'react'

import { transactions } from '@components/TransactionHistory/TransactionHistory.stories'
import { ThemeProvider } from '@styles/theme'
import { render, screen } from '@testing-library/react'

import UserAddressesModal from './UserAddressesModal.component'
import { tokenBalancesAcrossChains } from './UserAddressesModal.constants'

const mockFn = jest.fn()

describe('UserAddressesModal', () => {
  it('display correctly error message', () => {
    render(
      <ThemeProvider>
        <UserAddressesModal
          title={'Account'}
          open={true}
          accountAddress={'0x5124va000xza'}
          handleDisconnectWallet={mockFn}
          tokenBalancesAcrossChains={tokenBalancesAcrossChains}
          isFetchingBalances={false}
          onClick={mockFn}
          transactions={transactions}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Wrong address')).toBeInTheDocument()
  })
})
