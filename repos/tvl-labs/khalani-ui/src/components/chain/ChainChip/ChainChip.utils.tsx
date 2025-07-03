import React, { ReactElement } from 'react'

import ChainChip from './ChainChip.component'

export const createNetworkChip = (
  chainId: number,
  chainName?: string,
): ReactElement => <ChainChip chainId={chainId} chainName={chainName} />
