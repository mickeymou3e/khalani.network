import React, { ComponentProps } from 'react'

import { OperationStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import OperationTitle from './OperationTitle.component'

// export default {
//   title: 'Components/History/OperationTitle',
//   description: '',
//   component: OperationTitle,
// }

export default { component: OperationTitle }
const Template: Story<ComponentProps<typeof OperationTitle>> = () => (
  <Box p={2} width={250}>
    <OperationTitle status={OperationStatus.Pending} text="Pending" />
    <OperationTitle status={OperationStatus.Fail} text="Fail" />
    <OperationTitle status={OperationStatus.Aborted} text="Aborted" />
    <OperationTitle status={OperationStatus.Success} text="Success" />
    <OperationTitle status={OperationStatus.Waiting} text="Waiting" />
  </Box>
)

export const Basic = Template.bind({})
