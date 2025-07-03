import { Box } from "@mui/material";

import { Contents } from "./Contents";
import { Header } from "./Header";
import { containerStyle } from "./OrderEntryTicket.styles";

const OrderEntryTicket = () => (
  <Box sx={containerStyle}>
    <Header />
    <Contents />
  </Box>
);

export default OrderEntryTicket;
