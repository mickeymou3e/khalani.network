import { Divider, LinearProgress, styled } from '@mui/material'
import { linearProgressClasses } from '@mui/material/LinearProgress'

export const CustomizedLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 9999,
  [`&.${linearProgressClasses.colorPrimary}, &.${linearProgressClasses.colorSecondary}`]: {
    backgroundColor: theme.palette.elevation.dark,
  },
  [`& .${linearProgressClasses.barColorPrimary}`]: {
    borderRadius: 12,
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${linearProgressClasses.barColorSecondary}`]: {
    borderRadius: 12,
    backgroundColor: '#FF0000',
  },
}))

export const LinearProgressDivider = styled(Divider)(
  ({ theme }) => `
    position: absolute;
    top: -4px;
    bottom: -4px;
    width: 2px;
    background-color: ${theme.palette.elevation.dark};
    transform: translateX(-50%);
  `,
)
