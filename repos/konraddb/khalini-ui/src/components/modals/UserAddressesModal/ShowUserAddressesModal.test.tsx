import React from 'react'

import { ThemeProvider } from '@styles/theme'
import { render, screen } from '@testing-library/react'

import UserAddressesModal from './UserAddressesModal.component'

describe('UserAddressesModal', () => {
  const addresses = [
    {
      address: '0x16948b579240a89d306901dc7d91ad2dbc058fd4',
      networkName: 'godwoken',
      explorers: [
        {
          url: 'https://rinkeby.etherscan.io/address/',
          name: 'GODWOKEN EXPLORER',
        },
        { url: 'https://aggron.layerview.io/account/', name: 'ETH EXPLORER' },
      ],
    },
    {
      address: 'dupa',
      networkName: 'godwoken',
      explorers: [
        {
          url: 'https://explorer.nervos.org/aggron/address/',
          name: 'CKB EXPLORER',
        },
      ],
    },
  ]

  it('display correctly error message', () => {
    render(
      <ThemeProvider>
        <UserAddressesModal
          title={'Account'}
          open={true}
          addresses={addresses}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Wrong address')).toBeInTheDocument()
  })
})
