import { type CreateAppKit, createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {
  arbitrumSepolia,
  sepolia,
  baseSepolia,
  optimismSepolia,
  avalancheFuji,
} from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = "b28058f715e4554d6d268810e222da13";

const networks: CreateAppKit["networks"] = [
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  avalancheFuji,
];

const metadata = {
  name: "Hyperstream",
  description: "Hyperstream",
  url: "https://khalani.network",
  icons: ["https://khalani.network/favicon.ico"],
};

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

export const appkit = createAppKit({
  adapters: [wagmiAdapter, new EthersAdapter()],
  networks,
  metadata,
  projectId,
});
