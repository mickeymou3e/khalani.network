import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@hadouken-project/ui'
import { Box } from '@mui/material'
import { allowanceSelectors } from '@store/allowance/allowance.selector'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { StoreDispatch } from '@store/store.types'

import ApproveButton from '../ApproveButton'
import { IApprovalToken } from '../ApproveButton/ApproveButton.types'
import { messages } from './ConfirmButton.messages'
import { IConfirmButtonProps } from './ConfirmButton.types'

const ConfirmButton: React.FC<IConfirmButtonProps> = (props) => {
  const { onClick, text, disabled, expectedChainId, tokensWithAmount } = props
  const dispatch = useDispatch<StoreDispatch>()

  const currentNetwork = useSelector(networkSelectors.network)
  const allowances = useSelector(allowanceSelectors.allowances)

  const [needApprove, setNeedApprove] = useState<boolean>(false)
  const [tokensToApprove, setTokensToApprove] = useState<IApprovalToken[]>([])
  const needChangeNetwork = currentNetwork !== expectedChainId

  const handleButtonClick = (): void => {
    needChangeNetwork
      ? dispatch(networkActions.updateExpectedNetwork(expectedChainId))
      : onClick()
  }

  useEffect(() => {
    const tokensWithNeededApprove: IApprovalToken[] = []
    if (tokensWithAmount) {
      tokensWithAmount.map((token) => {
        const foundAllowance = allowances.find(
          (allowance) => allowance.tokenAddress === token.address,
        )
        if (foundAllowance?.balance.lt(token.amount)) {
          tokensWithNeededApprove.push(token)
        }
      })
      setTokensToApprove(tokensWithNeededApprove)
      setNeedApprove(tokensWithNeededApprove.length > 0)
    }
  }, [tokensWithAmount, allowances])

  return (
    <Box display="flex" justifyContent="flex-end" mt={6}>
      <Box minWidth={{ xs: '100%', md: 120 }}>
        {needApprove ? (
          tokensWithAmount && (
            <ApproveButton tokensToApprove={tokensToApprove} />
          )
        ) : (
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            sx={{ ml: 0 }}
            onClick={handleButtonClick}
            text={needChangeNetwork ? messages.BUTTON_LABEL : text}
            disabled={!needChangeNetwork && disabled}
          />
        )}
      </Box>
    </Box>
  )
}

export default ConfirmButton
