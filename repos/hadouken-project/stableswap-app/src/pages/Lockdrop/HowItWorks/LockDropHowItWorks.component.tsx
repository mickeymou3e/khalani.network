import React from 'react'

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'

import { MESSAGES } from '../Lockdrop.messages'
import { StyledTableCell } from '../LocksTable/StyledTableCell.component'

export const LockDropHowItWorks: React.FC = () => {
  return (
    <Paper>
      <Box>
        <Typography variant="paragraphBig">
          {MESSAGES.HOW_IT_WORKS_TITLE}
        </Typography>
      </Box>
      <Box mt={2}>
        <Box>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.ENTRY_DAYS_DESCRIPTION}
          </Typography>
        </Box>

        <Box mt={3}>
          <TableContainer component={Box}>
            <Table sx={{ width: '100%' }}>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    text={MESSAGES.PARTICIPATING_HOURS}
                    width="25%"
                  />
                  <StyledTableCell text="0-24" width="25%" />
                  <StyledTableCell text="24-48" width="25%" />
                  <StyledTableCell text="48-72" width="25%" />
                </TableRow>
                <TableRow>
                  <StyledTableCell text={MESSAGES.MULTIPLIER} width="25%" />
                  <StyledTableCell text="2x" width="25%" />
                  <StyledTableCell text="1.5x" width="25%" />
                  <StyledTableCell text="1x" width="25%" />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box mt={4}>
        <Box>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.LOCK_PERIOD_DESCRIPTION}
          </Typography>
        </Box>

        <Box mt={3}>
          <TableContainer component={Box}>
            <Table sx={{ width: '100%' }}>
              <TableBody>
                <TableRow>
                  <StyledTableCell text={MESSAGES.LOCK_PERIOD} width="20%" />
                  <StyledTableCell text="14 Days" width="20%" />
                  <StyledTableCell text="30 Days" width="20%" />
                  <StyledTableCell text="120 Days" width="20%" />
                  <StyledTableCell text="365 Days" width="20%" />
                </TableRow>
                <TableRow>
                  <StyledTableCell text={MESSAGES.MULTIPLIER} width="20%" />
                  <StyledTableCell text="0.2x" width="20%" />
                  <StyledTableCell text="0.6x" width="20%" />
                  <StyledTableCell text="1x" width="20%" />
                  <StyledTableCell text="2x" width="20%" />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Paper>
  )
}
