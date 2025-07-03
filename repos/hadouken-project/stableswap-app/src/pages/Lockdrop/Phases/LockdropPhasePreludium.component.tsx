import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { format } from 'date-fns'

import { ArrowDownIcon } from '@hadouken-project/ui'
import { ArrowRightAltSharp } from '@mui/icons-material'
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Link,
} from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'

import { MESSAGES } from '../Lockdrop.messages'

export const CircleStep = ({ text }: { text: string }): ReactElement => {
  return (
    <Box
      width="50px"
      height="50px"
      borderRadius="100%"
      border={(theme) =>
        `2px solid ${theme.palette.background.backgroundBorder}`
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {text}
    </Box>
  )
}

export const LockdropPhasePreludium: React.FC = () => {
  const phaseOneStartTime = useSelector(lockdropSelectors.phaseOneStartTime)

  return (
    <Box>
      <Typography variant="h1" ml={2}>
        {MESSAGES.LOCKDROP_PRELUDIUM}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Paper>
            <Typography
              align="justify"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.PRELUDIUM_TITLE}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ minHeight: '170px' }}>
            <Typography variant="paragraphMedium" ml={1}>
              Lockdrop starts
            </Typography>
            <Box
              bgcolor={(theme) => theme.palette.background.deepBlue}
              p={2}
              mt={1}
              width="fit-content"
            >
              {phaseOneStartTime && (
                <Typography color={(theme) => theme.palette.tertiary.main}>
                  {format(phaseOneStartTime * 1000, 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ minHeight: '170px' }}>
            <Typography variant="paragraphMedium">Medium</Typography>
            <Typography
              variant="paragraphSmall"
              color={(theme) => theme.palette.text.gray}
              mt={2}
            >
              See more details on our Medium post
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                variant="paragraphSmall"
                underline="none"
                sx={(theme) => ({
                  background: 'transparent',
                  color: theme.palette.tertiary.main,
                })}
              >
                <Box display="flex" alignItems="center" mt={2}>
                  <Typography>Go to medium</Typography>
                  <Box ml={1} mt={1}>
                    <ArrowRightAltSharp />
                  </Box>
                </Box>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={6} ml={2}>
        <Typography variant="h4Bold">Check details about phase</Typography>
      </Box>
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ArrowDownIcon fill="#fff" />}>
          <Typography variant="h4Bold">{MESSAGES.TITLE} 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="1" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Explore Locking Options
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  In Phase 1, you have the flexibility to choose between
                  different lock durations, each offering unique rewards and
                  boosts:
                </Typography>
                <Box>
                  <Box mt={2}>
                    <Typography variant="paragraphSmall">
                      14 Days Lock: Opt for a short-term lock with exciting
                      short-term benefits.
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="paragraphSmall">
                      30 Days Lock: A medium-term lock, offering a balance
                      between risk and reward.
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="paragraphSmall">
                      120 Days Lock: A longer-term commitment for those looking
                      for stable, sustained growth.
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="paragraphSmall">
                      365 Days Lock: Go all-in with a full-year lock, maximizing
                      your potential earnings.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="2" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Understand Boost Mechanisms
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  Lockdrop Phase 1 introduces two key boost mechanisms:
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  Day Boost: The first day of your lock comes with an additional
                  boost, increasing your potential rewards.
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  Lock Length Boost: The longer you lock your assets, the
                  greater your boost, enhancing your overall earnings. Choose a
                  lock duration that suits your investment strategy.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="3" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Lock asset
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  To participate in lockdrop you have to lock one of your asset
                  Boosted USD or Boosted Tricrypto.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="4" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Monitor Your Lock
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  Once your assets are locked, you can monitor your lock
                  duration and expected rewards on the platform. Keep track of
                  your progress throughout the lock period.
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ArrowDownIcon fill="#fff" />}>
          <Typography variant="h4Bold">{MESSAGES.TITLE} 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="1" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Claiming Rewards
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  If you participated in a previous Lockdrop phase and have
                  locked your tokens you can claim HDK tokens
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="2" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Depositing ETH and HDK Tokens
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  To participate in Lockdrop Phase 2 and help set the HDK token
                  price you can deposit both ETH and HDK tokens
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="3" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Setting the HDK Token Price
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  Your participation in the liquidity pool helps set the HDK
                  token price. The more liquidity you provide, the more
                  influence you have on the price.
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ArrowDownIcon fill="#fff" />}>
          <Typography variant="h4Bold">{MESSAGES.TITLE} 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="1" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Claiming LP Tokens
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  If you deposited in Phase 2, you have the opportunity to claim
                  your LP tokens in Phase 3. These LP tokens represent your
                  share in the liquidity pool, and their withdrawal is linear
                  over a 3-month period.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="2" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  Unlocking Assets from Phase 1
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  For participants who locked assets in Phase 1, Phase 3
                  provides the opportunity to unlock them.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor={(theme) => theme.palette.background.deepBlue}
            mt={4}
            p={2}
          >
            <Box display="flex">
              <Box mr={2}>
                <CircleStep text="3" />
              </Box>
              <Box>
                <Typography
                  variant="paragraphMedium"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  HDK Token Redemption for Missed Phase 2 Claims
                </Typography>
                <Typography variant="paragraphSmall" mt={1}>
                  If you didnt claim your HDK tokens in Phase 2, dont worry; you
                  can still redeem them in Phase 3.
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
