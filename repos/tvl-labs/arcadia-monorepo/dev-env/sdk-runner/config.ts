import * as path from "path";
import {
  collectLatestMTokens,
  getIntentBookAddress,
  getAssetReservesAddress,
} from "./contracts-loader";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildDevEnvConfig(): Promise<any> {
  const hubAddPath = path.join(
    __dirname,
    "../..",
    "contracts",
    "broadcast",
    "HubAddMToken.s.sol",
    "31337"
  );
  const latestMTokens = await collectLatestMTokens(hubAddPath);

  const hubDeployPath = path.join(
    __dirname,
    "../..",
    "contracts",
    "broadcast",
    "HubDeployCoreProtocol.s.sol",
    "31337"
  );

  const intentBookAddr = await getIntentBookAddress(hubDeployPath);

  const spoke1DeployPath = path.join(
    __dirname,
    "../..",
    "contracts",
    "broadcast",
    "SpokeDeployHyperFlowBridge.s.sol",
    "31338"
  );

  const spoke2DeployPath = path.join(
    __dirname,
    "../..",
    "contracts",
    "broadcast",
    "SpokeDeployHyperFlowBridge.s.sol",
    "31339"
  );

  const assetReservesSpoke1 = await getAssetReservesAddress(spoke1DeployPath);
  const assetReservesSpoke2 = await getAssetReservesAddress(spoke2DeployPath);

  const devEnvConfig = {
    contracts: {
      IntentBook: intentBookAddr,
      AssetReserves: {
        "0x7a6a": assetReservesSpoke1,
        "0x7a6b": assetReservesSpoke2,
      },
      permit2: {
        "0x7a6a": "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        "0x7a6b": "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      },
    },
    supportedChains: [
      {
        id: 31337,
        chainName: "HubLocal",
        chainId: "0x7A69",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["http://localhost:8545"],
        rpcUrls: ["http://127.0.0.1:8545"],
        logo: "",
        borderColor: "#888888",
        poolTokenSymbols: ["ETH", "USDC"],
        isBalancerChain: true,
      },
      {
        id: 31338,
        chainName: "SpokeLocal1",
        chainId: "0x7a6a",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["http://localhost:8546"],
        rpcUrls: ["http://127.0.0.1:8546"],
        logo: "",
        borderColor: "#888888",
        poolTokenSymbols: ["ETH", "USDC"],
        isBalancerChain: false,
      },
      {
        id: 31339,
        chainName: "SpokeLocal2",
        chainId: "0x7a6b",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["http://localhost:8547"],
        rpcUrls: ["http://127.0.0.1:8547"],
        logo: "",
        borderColor: "#888888",
        poolTokenSymbols: ["ETH", "USDC"],
        isBalancerChain: false,
      },
    ],
    tokens: [
      {
        id: "USDC",
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
        chainId: "0x7a6a",
        sourceChainId: "0x7a6a",
      },
      {
        id: "USDT",
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        decimals: 6,
        name: "USDT Coin",
        symbol: "USDT",
        chainId: "0x7a6a",
        sourceChainId: "0x7a6a",
      },
      {
        id: "USDC",
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
        chainId: "0x7a6b",
        sourceChainId: "0x7a6b",
      },
      {
        id: "USDT",
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        decimals: 6,
        name: "USDT Coin",
        symbol: "USDT",
        chainId: "0x7a6b",
        sourceChainId: "0x7a6b",
      },
    ],
    mTokens: [
      {
        id: "MUSDC",
        address: latestMTokens["USDC-31338"],
        decimals: 6,
        name: "MUSDC Coin",
        symbol: "USDC",
        chainId: "0x7a69",
        sourceChainId: "0x7a6a",
      },
      {
        id: "MUSDT",
        address: latestMTokens["USDT-31338"],
        decimals: 6,
        name: "MUSDT Coin",
        symbol: "USDT",
        chainId: "0x7a69",
        sourceChainId: "0x7a6a",
      },
      {
        id: "MUSDC",
        address: latestMTokens["USDC-31339"],
        decimals: 6,
        name: "MUSDC Coin",
        symbol: "USDC",
        chainId: "0x7a69",
        sourceChainId: "0x7a6b",
      },
      {
        id: "MUSDT",
        address: latestMTokens["USDT-31339"],
        decimals: 6,
        name: "MUSDT Coin",
        symbol: "USDT",
        chainId: "0x7a69",
        sourceChainId: "0x7a6b",
      },
    ],
    medusa: {
      apiUrl: "http://127.0.0.1:8001",
      wsUrl: "ws://127.0.0.1:8001",
    },
  };

  return devEnvConfig;
}

(async () => {
  await buildDevEnvConfig();
})();
