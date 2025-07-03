import { createNetworkChip } from '@components/chain/ChainChip/ChainChip.utils'
import { ENetwork } from '@interfaces/core'
import { render, screen } from '@testing-library/react'

import { getNetworkIcon } from './network'

describe('createNetworkChip function', () => {
  it('should return chip element', () => {
    const chainId = ENetwork.EthereumSepolia

    render(createNetworkChip(chainId, 'Ethereum Goerli'))
    const chip = screen.queryByTestId('chainChip')
    expect(chip).toBeInTheDocument()
  })
})

describe('getNetworkIcon function', () => {
  it('should return svg element', () => {
    const chainId = ENetwork.Avalanche

    const { container } = render(getNetworkIcon(chainId))
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
