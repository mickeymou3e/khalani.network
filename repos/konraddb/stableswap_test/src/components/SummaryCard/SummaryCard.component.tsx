import React from 'react'

import { Box, Paper, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { getRepresentativeValue } from '@utils/string'

import { ISummaryCardProps } from './SummaryCard.types'

const SummaryCard: React.FC<ISummaryCardProps> = ({
  label,
  tokens,
  additionalLabel,
  isFetching,
}) => {
  return (
    <Paper
      elevation={1}
      component={(props) => (
        <Box
          {...props}
          display="flex"
          alignItems="center"
          flexDirection="column"
          minHeight={140}
          height="100%"
          width="100%"
        />
      )}
    >
      <Box display="flex" justifyContent="center" width="100%" padding={0.5}>
        <Typography
          component="h3"
          style={{
            fontSize: '12px',
          }}
        >
          <b>{label.toUpperCase()}</b>
        </Typography>
      </Box>
      <Box
        paddingY={2}
        paddingX={{ xs: 2, md: 6 }}
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box mt={2} ml={2} width="100%">
          {isFetching && tokens.length === 0 ? (
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              marginBottom={2}
              height={60}
            >
              <Box marginRight={1} height="100%" width="100%">
                <Skeleton variant="rectangular" height={48} width="100%" />
              </Box>
            </Box>
          ) : (
            tokens.map((token) => {
              return (
                <Box
                  key={token.id}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="center"
                  marginBottom={2}
                  height={60}
                >
                  {!isFetching ? (
                    <>
                      <Box marginRight={1}>
                        <Typography
                          color="textPrimary"
                          style={{
                            fontSize: '46px',
                          }}
                        >
                          <i>
                            <b>{getRepresentativeValue(token.displayValue)}</b>
                          </i>
                        </Typography>
                      </Box>
                      <Typography
                        color="textPrimary"
                        style={{
                          fontSize: '19px',
                        }}
                      >
                        {token.symbol}
                      </Typography>
                    </>
                  ) : (
                    <Box marginRight={1} height="100%" width="100%">
                      <Skeleton
                        variant="rectangular"
                        height={48}
                        width="100%"
                      />
                    </Box>
                  )}
                </Box>
              )
            })
          )}
        </Box>
        <Box>
          <Typography variant="caption" color="primary">
            {additionalLabel}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default SummaryCard
