"use client";

import { useConnection } from "@/connection/useConnection.hook";
import { Footer, Header, LogoIcon, Button } from "@hadouken-project/ui";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    handleConnectToMetamask,
    isConnected,
    address,
    nativeTokenBalance,
    handleDisconnect,
    isConnectedToConnectNetwork,
    handleSwitchNetwork,
    network,
  } = useConnection();

  return (
    <main>
      <Header RouterLink="link" chainId={1} hideRightPanel />
      <Box sx={{ height: "80dvh" }} p={3}>
        <Typography variant="h1">Hadouken - Blast Lockdrop</Typography>

        {isClient && (
          <Box>
            <Box>
              {isConnected ? (
                <Button
                  text="Disconnect"
                  variant="contained"
                  onClick={handleDisconnect}
                />
              ) : (
                <Button
                  text="Connect wallet"
                  variant="contained"
                  onClick={handleConnectToMetamask}
                />
              )}

              {!isConnectedToConnectNetwork && isConnected && (
                <Button
                  text="Switch network"
                  variant="contained"
                  onClick={handleSwitchNetwork}
                />
              )}
            </Box>
            <Box mt={2}>
              {isConnected && (
                <Box>
                  <Typography>Address: {address}</Typography>
                  <Typography>
                    Balance:{" "}
                    {isConnectedToConnectNetwork ? nativeTokenBalance : 0}
                  </Typography>
                  <Typography>Network: {network}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Footer logo={LogoIcon} />
    </main>
  );
}
