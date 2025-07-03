import React, { useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import ButtonLayout from '@components/buttons/ButtonLayout'
import Modal from '@components/modals/Modal'
import { Divider, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { testIds } from '@utils/dataTestIds'

import ModalHeader from '../ModalHeader'
import { messages } from './ChangeNetworkModal.messages'
import { IChangeNetworkModalProps } from './ChangeNetworkModal.types'

const ChangeWalletNetworkModal: React.FC<IChangeNetworkModalProps> = ({
  open,
  title = messages.TITLE,
  previousNetwork,
  expectedNetwork,
  handleClose,
  changeNetwork,
}) => {
  const theme = useTheme()
  const [responseWaiting, setResponseWaiting] = useState(false)

  useEffect(() => {
    open ? setResponseWaiting(false) : null
  }, [open])

  const handleChangeWalletNetwork = () => {
    setResponseWaiting(true)
    changeNetwork?.()
  }
  return (
    <Modal open={open} handleClose={handleClose}>
      <ModalHeader title={title} handleClose={handleClose} />
      <Box
        height="100%"
        alignItems="start"
        display="flex"
        flexDirection="column"
      >
        <Typography
          color={(theme) => theme.palette.text.secondary}
          variant="body2"
        >
          {messages.TITLE_1}
          {` `}

          <b style={{ color: theme.palette.text.secondary }}>
            {previousNetwork ?? '-'}
          </b>
          {` `}
          {messages.TITLE_2}
          {` `}
          <b style={{ color: theme.palette.text.secondary }}>
            {expectedNetwork ?? '-'}
          </b>
          {` `}
          {messages.TITLE_3}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <ButtonLayout sx={{ ml: 'auto' }}>
        <Button
          text={messages.DISMISS}
          onClick={handleClose}
          variant="contained"
          color="secondary"
          size="large"
        />

        <Button
          data-testid={testIds.SWITCH_NETWORK}
          text={
            responseWaiting ? (
              <CircularProgress color="inherit" />
            ) : (
              messages.NETWORK_CHANGE
            )
          }
          disabled={responseWaiting}
          onClick={handleChangeWalletNetwork}
          variant="contained"
          size="large"
        />
      </ButtonLayout>
    </Modal>
  )
}

export default ChangeWalletNetworkModal
