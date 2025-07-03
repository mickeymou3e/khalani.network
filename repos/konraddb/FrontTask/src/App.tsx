import React from "react";
import "./App.css";
import Web3Provider from "web3-react";
import { Connectors } from "web3-react";
import Web3 from "web3";
import { Box, Container, ThemeProvider } from "@mui/material";

import Activator from "./web3/connector";
import { defaultTheme } from "./theme";

const { NetworkOnlyConnector } = Connectors;

function App() {
  const Infura = new NetworkOnlyConnector({
    providerURL:
      "https://mainnet.infura.io/v3/581996b3a5b944949630f2535e9bb59b",
  });

  const connectors = { Infura };

  return (
    <div>
      <Web3Provider
        connectors={connectors}
        libraryName={"web3.js"}
        web3Api={Web3}
      >
        <ThemeProvider theme={defaultTheme}>
          <Container maxWidth="sm">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100vh"
            >
              <Activator />
            </Box>
          </Container>
        </ThemeProvider>
      </Web3Provider>
    </div>
  );
}

export default App;
