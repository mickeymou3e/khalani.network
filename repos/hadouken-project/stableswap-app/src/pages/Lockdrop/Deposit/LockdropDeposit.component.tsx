import React, { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { Button, TokenInput } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { BigDecimal } from '@utils/math'

import { MESSAGES } from '../Lockdrop.messages'

export const LockdropDeposit = (): ReactElement => {
  const dispatch = useDispatch()
  const depositTokens = useSelector(lockdropSelectors.phaseTwoDepositTokens)

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )

  const tokenBalance = selectUserTokensBalances(
    depositTokens?.map((token) => token.address),
  )

  const depositTokensAmount = useSelector(
    lockdropSelectors.phaseTwoDepositTokensAmounts,
  )

  const isInProgress = useSelector(
    lockdropSelectors.phaseTwoDepositIsInProgress,
  )

  const onAmountChange = (
    amount: BigDecimal | undefined,
    tokenAddress: string,
  ) => {
    dispatch(
      lockDropActions.phaseTwoDepositTokenAmountChange({
        amount,
        tokenAddress,
      }),
    )
  }

  const onDeposit = () => {
    dispatch(lockDropActions.phaseTwoDepositRequest())
  }

  const everyDepositAmountEqualToZero = useSelector(
    lockdropSelectors.phaseTwoDepositAmountsEqualToZero,
  )

  const someDepositAmountIsGreaterThanBalance = Object.entries(
    depositTokensAmount ?? {},
  ).some(([tokenAddress, tokenAmount]) =>
    tokenAmount?.gt(tokenBalance?.[tokenAddress] ?? BigDecimal.from(0)),
  )

  return (
    <Paper>
      <Box>
        <Typography variant="h4Bold">{MESSAGES.DEPOSIT_HEADING}</Typography>
      </Box>
      <Box mt={2}>
        <Typography
          variant="paragraphTiny"
          color={(theme) => theme.palette.text.gray}
        >
          {MESSAGES.DEPOSIT_DESCRIPTION(
            depositTokens[0].symbol,
            depositTokens[1].symbol,
          )}
        </Typography>
      </Box>
      <Box mt={4}>
        {depositTokens?.map((token) => (
          <Box mt={3} key={token.id}>
            <TokenInput
              maxAmount={
                tokenBalance?.[token.address]?.toBigNumber() ??
                BigNumber.from(0)
              }
              amount={
                depositTokensAmount?.[token.address]?.toBigNumber() ?? undefined
              }
              onMaxRequest={() => {
                onAmountChange(tokenBalance?.[token.address], token.address)
              }}
              onAmountChange={(amount) =>
                onAmountChange(
                  amount ? BigDecimal.from(amount, token.decimals) : undefined,
                  token.address,
                )
              }
              token={{
                address: token.address,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                id: token.id,
                displayName: token.displayName ?? token.name,
                source: token.source ?? '',
              }}
            />
          </Box>
        ))}
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          isFetching={isInProgress}
          disabled={
            isInProgress ||
            everyDepositAmountEqualToZero ||
            someDepositAmountIsGreaterThanBalance
          }
          text={MESSAGES.DEPOSIT}
          onClick={onDeposit}
        />
      </Box>
    </Paper>
  )
}
