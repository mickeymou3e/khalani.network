import React from 'react'

import { LiquidityProvisionType } from '@dataSource/graph/pools/poolLiquidity/types'
import { InvestIcon, WithdrawIcon } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'

import { MESSAGES } from './PoolLiquidity.messages'
import { LiquidityToggle } from './PoolLiquidity.types'

const FIELD_NAME = {
  ACTION: 'action',
  TOKENS: 'tokens',
  TIME: 'time',
}

const LIQUIDITY_PROVISION_TYPE = {
  [LiquidityProvisionType.Join]: (
    <Box display="flex" alignItems="center">
      <Box mb={0.2}>
        <InvestIcon />
      </Box>
      <Typography ml={1} variant="paragraphMedium">
        {MESSAGES.INVEST}
      </Typography>
    </Box>
  ),
  [LiquidityProvisionType.Exit]: (
    <Box display="flex" alignItems="center">
      <Box mb={1}>
        <WithdrawIcon />
      </Box>
      <Typography ml={1} variant="paragraphMedium">
        {MESSAGES.WITHDRAW}
      </Typography>
    </Box>
  ),
}

const TOGGLE_OPTIONS_LIQUIDITY = [
  { id: LiquidityToggle.MyLiquidity, name: 'My liquidity', disabled: false },
  { id: LiquidityToggle.AllLiquidity, name: 'All liquidity', disabled: false },
]

export { FIELD_NAME, LIQUIDITY_PROVISION_TYPE, TOGGLE_OPTIONS_LIQUIDITY }
