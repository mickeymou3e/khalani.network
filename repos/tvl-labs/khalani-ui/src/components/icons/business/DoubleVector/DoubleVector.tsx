import React from 'react'

import { IIcon } from '@interfaces/core'
import { Box } from '@mui/material'

import ArrowDownIcon from '../ArrowDown'
import ArrowUpIcon from '../ArrowUp'

const DoubleVector: React.FC<IIcon> = ({ fill = '#FFFFFF' }) => (
  <Box
    position="absolute"
    right="13px"
    display="flex"
    flexDirection="column"
    gap={0.75}
  >
    <ArrowUpIcon style={{ overflow: 'visible' }} fill={fill} />
    <ArrowDownIcon style={{ overflow: 'visible' }} fill={fill} />
  </Box>
)

export default DoubleVector
