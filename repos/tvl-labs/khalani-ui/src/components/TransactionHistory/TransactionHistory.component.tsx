import React from 'react'

import { SwapRight } from '@components/icons'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { Box, Typography } from '@mui/material'
import { formatWithCommas } from '@utils/text'

import { transactionTypes } from './TransactionHistory.constants'
import { TransactionHistoryItem } from './TransactionHistory.styled'
import { TransactionHistoryProps } from './TransactionHistory.types'

const TransactionHistory: React.FC<TransactionHistoryProps> = (props) => {
  const { transactions, onClick } = props

  const handleClick = (transactionHash: string) => {
    onClick(transactionHash)
  }

  return (
    <Box mt={2}>
      {transactions.map((transaction, index) => (
        <TransactionHistoryItem
          py={1}
          px={2}
          mb={0.5}
          key={index}
          onClick={() => handleClick(transaction.hash)}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="overline" color="text.secondary">
              {transactionTypes.find((t) => t.type === transaction.type)?.text}
            </Typography>
            <Typography variant="overline" color="text.secondary">
              {transaction.time}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection={transaction.destinationToken ? 'row' : 'column'}
              gap={0.5}
            >
              {transaction.sourceTokens.map((token, index) => (
                <React.Fragment key={index}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TokenWithNetwork
                      chainId={parseInt(token.network, 16)}
                      tokenSymbol={token.symbol}
                    />
                    <Typography variant="button">{token.symbol}</Typography>
                  </Box>
                </React.Fragment>
              ))}
              {transaction.destinationToken && (
                <>
                  <SwapRight style={{ width: 18, height: 18 }} />
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TokenWithNetwork
                      chainId={parseInt(
                        transaction.destinationToken.network,
                        16,
                      )}
                      tokenSymbol={transaction.destinationToken.symbol}
                    />
                    <Typography variant="button" color="text.secondary">
                      {transaction.destinationToken.symbol}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
            <Box display="flex" flexDirection="column" gap={0.5}>
              {transaction.amounts.map((amount, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {formatWithCommas(
                    amount,
                    transaction.sourceTokens[index].decimals ?? 6,
                  )}
                </Typography>
              ))}
            </Box>
          </Box>
        </TransactionHistoryItem>
      ))}
    </Box>
  )
}

export default TransactionHistory
