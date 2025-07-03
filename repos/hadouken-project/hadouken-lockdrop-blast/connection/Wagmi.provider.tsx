"use client";

import { PropsWithChildren, FC } from "react";
import { createPublicClient, http } from "viem";
import { createConfig, mainnet, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains: [mainnet] })],
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
