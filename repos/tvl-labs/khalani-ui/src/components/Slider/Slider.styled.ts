import { Slider, styled } from '@mui/material'

export const CustomizedSlider = styled(Slider)(
  () => `
      .MuiSlider-thumb {
        width: 25px;
        height: 25px;
      }
   `,
)
