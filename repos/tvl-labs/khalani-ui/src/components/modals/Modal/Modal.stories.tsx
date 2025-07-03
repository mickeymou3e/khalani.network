import React, { ComponentProps } from 'react'

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import ModalHeader from '../ModalHeader'
import Modal from './'

export default {
  title: 'Components/Modals/Modal',
  description: '',
  component: Modal,
}

const Template: Story<ComponentProps<typeof Modal>> = (args) => (
  <Box>
    <Modal {...args}>
      <Box textAlign="center">
        <ModalHeader title={'Header'} />
        <Typography
          textAlign="start"
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo maiores
          consequatur autem eveniet rem quae sint quod in recusandae delectus
          nulla odio corrupti exercitationem ipsum ullam, minus inventore
          tempore omnis?
        </Typography>
      </Box>
    </Modal>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  open: true,
}
