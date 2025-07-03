import { Box, CssBaseline, ThemeProvider } from "@mui/material";

import { AppLayout } from "@/components/organisms";
import { darkTheme } from "@/styles/themes";

import { Holdings } from "./Holdings";
import { OrderEntryTicket } from "./OrderEntryTicket";
import { TopBar } from "./TopBar";
import { containerStyle } from "./TradePage.styles";
import { useTradePage } from "./useTradePage";

const TradePage = () => {
  useTradePage();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppLayout>
        <TopBar />
        <Box sx={containerStyle}>
          <Holdings />
          <OrderEntryTicket />
        </Box>
      </AppLayout>
    </ThemeProvider>
  );
};

export default TradePage;
