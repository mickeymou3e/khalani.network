import React from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@hadouken-project/ui'
import { approveActions } from '@store/approve/approve.slice'
import { StoreDispatch } from '@store/store.types'

import { messages } from './ApproveButton.messages'
import { IApproveButtonProps } from './ApproveButton.types'

const ApproveButton: React.FC<IApproveButtonProps> = (props) => {
  const { tokensToApprove } = props
  const dispatch = useDispatch<StoreDispatch>()

  const handleButtonClick = (): void => {
    dispatch(approveActions.approveRequest(tokensToApprove))
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      sx={{ ml: 0 }}
      onClick={handleButtonClick}
      text={messages.BUTTON_LABEL}
    />
  )
}

export default ApproveButton
