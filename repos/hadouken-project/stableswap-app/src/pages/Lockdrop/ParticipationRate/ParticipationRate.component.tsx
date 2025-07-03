import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { convertNumberToStringWithCommas } from '@hadouken-project/ui'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { networkSelectors } from '@store/network/network.selector'

import { PARTICIPATION_RATE } from '../Lockdrop.constants'
import { MESSAGES } from '../Lockdrop.messages'
import { StyledTableCell } from '../LocksTable/StyledTableCell.component'

export const ParticipationRate: React.FC = () => {
  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const totalHDKTokensOnChain = useSelector(
    lockdropSelectors.phaseTwoTotalHDKTokensOnChain,
  )
  const participationOnChain = useSelector(
    lockdropSelectors.phaseTwoParticipationOnChain,
  )

  const participationRateWithBonus = useMemo(() => {
    return PARTICIPATION_RATE.map((rate) => {
      const bonusHDKTokens =
        (totalHDKTokensOnChain.toNumber() * rate.bonusAllocation) / 100

      const isActive =
        participationOnChain.toNumber() >= rate.range[0] &&
        participationOnChain.toNumber() <= rate.range[1]

      return {
        ...rate,
        bonusHDKTokens,
        isActive,
      }
    })
  }, [participationOnChain, totalHDKTokensOnChain])

  return (
    <Paper>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4Bold" flex="50%">
            {MESSAGES.PARTICIPATION_BONUS}
          </Typography>
          <Typography flex="50%" align="right" variant="paragraphSmall">
            {MESSAGES.DISTRIBUTED} {applicationNetworkName}
            <Box
              display="block"
              color={(theme) => theme.palette.tertiary.main}
              component="span"
            >
              {convertNumberToStringWithCommas(
                totalHDKTokensOnChain.toNumber(),
                4,
                false,
              )}{' '}
              HDK
            </Box>
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography
            color={(theme) => theme.palette.text.gray}
            variant="paragraphTiny"
          >
            {MESSAGES.PARTICIPATION_RATE_DESCRIPTION}
          </Typography>
        </Box>
        <TableContainer component={Box} mt={4}>
          <Table sx={{ width: '100%' }}>
            <TableBody>
              <TableRow>
                <StyledTableCell
                  text={MESSAGES.PARTICIPATION_RATE}
                  width="33%"
                />
                <StyledTableCell text={MESSAGES.BONUS_ALLOCATION} width="33%" />
                <StyledTableCell text={MESSAGES.BONUS_HDK} width="33%" />
              </TableRow>
              {participationRateWithBonus.map((rate, index) => (
                <TableRow
                  key={index}
                  sx={(theme) => ({
                    background: rate.isActive
                      ? theme.palette.tertiary.main
                      : 'transparent',
                    color: rate.isActive
                      ? theme.palette.common.black
                      : theme.palette.common.white,
                  })}
                >
                  <StyledTableCell
                    text={`${rate.participationRate.toString()}%`}
                    width="33%"
                  />
                  <StyledTableCell
                    text={`${rate.bonusAllocation.toFixed(2)}%`}
                    width="33%"
                  />
                  <StyledTableCell
                    text={convertNumberToStringWithCommas(
                      rate.bonusHDKTokens,
                      2,
                      false,
                    )}
                    width="33%"
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <Box
            sx={(theme) => ({
              background: theme.palette.background.deepBlue,
              padding: 2,
              marginTop: 1,
            })}
          >
            <Typography
              color={(theme) => theme.palette.tertiary.light}
              variant="paragraphSmall"
            >
              {MESSAGES.EXAMPLE}
            </Typography>

            <Box mt={1}>
              <Typography
                color={(theme) => theme.palette.text.gray}
                variant="paragraphTiny"
              >
                {MESSAGES.EXAMPLE_DESCRIPTION}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
