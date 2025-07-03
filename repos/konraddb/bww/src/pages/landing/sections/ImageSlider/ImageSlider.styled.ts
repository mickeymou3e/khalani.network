import { Box, styled } from "@mui/material";

export const ImageItem = styled(Box)(
  () => `
   width:100%;
   height: 70vh;
   opacity: 0.6;
   background-repeat: no-repeat;
   background-attachment: fixed;
   background-size: cover;
   background-position: center;
   `
);

export const ImageOverlay = styled(Box)(
  () => `
   position: absolute;
   width:100%;
   top: 50%;
   transform: translate(0, -50%);
   left:0;
   `
);
