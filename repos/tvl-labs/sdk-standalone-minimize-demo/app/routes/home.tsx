import type { Route } from "./+types/home";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import { Button } from "~/components/ui/button";
import { appkit } from "~/configs/appkit";
import { formatAddress } from "~/helpers/formatAddress";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import type { Eip1193Provider } from "ethers";
import { BrowserProvider, JsonRpcProvider, parseUnits } from "ethers";
import { ArcadiaSDK, NetworkType } from "@tvl-labs/sdk/dist/standalone";
import { Network, RpcIntentState } from "@tvl-labs/sdk/dist/standalone/types";
import { useMutation } from "@tanstack/react-query";
import { arbitrumSepolia, sepolia } from "@reown/appkit/networks";
import type { RefineResult } from "@tvl-labs/sdk/dist/standalone/types/Refine";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hyperstream" },
    { name: "description", content: "Welcome to Hyperstream!" },
  ];
}

const sourceToken = {
  token: "0x386169652753d3304d94854c4c2cf50843c174ad",
  chainId: sepolia.id,
  decimals: 18n,
} as const;

const destinationToken = {
  token: "0x780d4721f6bd26897a72aff5cb4eee6f381f0c96",
  chainId: arbitrumSepolia.id,
  decimals: 18n,
} as const;

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const network = useAppKitNetwork();
  const account = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [input, setInput] = useState("1");
  const toastIdRef = useRef<number | string | null>(null);

  const { data: usdcBalance, refetch: refetchUsdcBalance } = useBalance({
    address: account.address,
    ...sourceToken,
  });

  const {
    data: destinationUsdcBalance,
    refetch: refetchDestinationUsdcBalance,
  } = useBalance({
    address: account.address,
    ...destinationToken,
  });

  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const { mutateAsync: createIntent, isPending: isCreatingIntent } =
    useMutation({
      async mutationFn() {
        if (!account.address) {
          await appkit.open();
          return;
        }
        await switchChainAsync({
          chainId: sourceToken.chainId,
        });
        const sdk = new ArcadiaSDK("EthersV5", NetworkType.testnet);

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const rpcURL = network.caipNetwork?.rpcUrls.default.http[0];
        const chainId = network.chainId;
        if (!rpcURL) throw new Error("No RPC URL");
        if (!chainId) throw new Error("Appkit Network.chainId not found");
        const chainId0x =
          typeof chainId === "string"
            ? chainId
            : `0x${network.chainId?.toString(16)}`;
        const jsonRpcProvider = new JsonRpcProvider(rpcURL);

        // Update the WalletService
        sdk.wallet.updateProvider(jsonRpcProvider);
        sdk.wallet.updateSigner(signer);
        sdk.wallet.updateNetworkAndAddress(
          signer.address,
          chainId0x as Network,
        );

        const amount = parseInt(input, 10);
        const mTokenAmount = parseUnits(`${amount}`, sourceToken.decimals);

        toastIdRef.current = toast.loading("1. ERC20 allowance");
        // 1. ERC20 allowance
        await sdk.depositService.ensureERC20Allowance(
          sourceToken.chainId,
          sourceToken.token,
          mTokenAmount,
        );
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("2. Deposit to asset reserves");
        // 2. Deposit to asset reserves
        await delay(2000);
        await sdk.depositService.depositTraditional(
          sourceToken.token,
          mTokenAmount,
        );
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("3. Wait for minting of mToken");
        // 3. Wait for minting of mToken
        await sdk.balanceService.waitForMinting(
          {
            address: sourceToken.token,
            chainId: `0x${sourceToken.chainId.toString(16)}`,
          },
          mTokenAmount,
          account.address,
        );
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("4. Create refine");
        // 4. Create refine
        const nonce = await sdk.intentService.getIntentNonce(account.address);
        const refineResult = await sdk.refineService.createRefine({
          accountAddress: account.address,
          fromChainId: sourceToken.chainId,
          fromTokenAddress: sourceToken.token,
          amount: mTokenAmount,
          toChainId: destinationToken.chainId,
          toTokenAddress: destinationToken.token,
          currentNonce: nonce + 1n,
          fillStructure: FillStructureMap[FillStructure.Exact],
        });
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("5. Query refine");
        // 5. Query refine
        const fullRefine = await sdk.refineService.queryRefine(refineResult);
        if (!isFullRefine(fullRefine)) {
          throw new Error("Refine failed or invalid");
        }
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("6. Sign and propose intent");
        // 6. Sign and propose intent
        const intentSig = await sdk.intentService.signIntent(fullRefine);
        const proposed = await sdk.intentService.proposeIntent({
          refineResult: fullRefine,
          signature: intentSig,
        });
        toast.dismiss(toastIdRef.current);

        toastIdRef.current = toast.loading("7. Wait for intent to be solved");
        // 7. Wait for intent to be solved
        const status = await sdk.intentService.pollIntentStatus(
          proposed.intentId,
          RpcIntentState.Solved,
        );

        const startTime = dayjs();
        const timeoutAt = startTime.add(10, "minute");

        while (true) {
          if (dayjs().isAfter(timeoutAt)) {
            throw new Error("Timeout: balance polling exceeded 10 minutes");
          }
          await refetchUsdcBalance();
          await refetchDestinationUsdcBalance();
          if (status === RpcIntentState.Solved) {
            return;
          }
          await delay(3000);
        }
      },
      onSuccess() {
        if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        toast.success("Swap completed");
      },
      onError(error) {
        if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        toast.error(error.message);
        console.error(error);
      },
    });

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() =>
          appkit.open({
            view: "Networks",
          })
        }
      >
        {network.caipNetwork?.name}
      </Button>
      <Button variant="secondary" onClick={() => appkit.open()}>
        {isConnected && address ? formatAddress(address) : "Connect Wallet"}
      </Button>
      <div>
        Source balance you have: {usdcBalance?.formatted} {usdcBalance?.symbol}
      </div>
      <div>
        Destination balance you have: {destinationUsdcBalance?.formatted}{" "}
        {destinationUsdcBalance?.symbol}
      </div>
      <Input
        type="number"
        step="any"
        min={0}
        value={input}
        onInput={(e) => setInput(e.currentTarget.alt)}
      />
      <Button onClick={() => createIntent()} disabled={isCreatingIntent}>
        Swap
      </Button>
    </div>
  );
}

export enum FillStructure {
  Exact = 0,
  Minimum = 1,
  PercentageFilled = 2,
  ConcreteRange = 3,
}

export const FillStructureMap: Record<FillStructure, string> = {
  [FillStructure.Exact]: "Exact",
  [FillStructure.Minimum]: "Minimum",
  [FillStructure.PercentageFilled]: "PercentageFilled",
  [FillStructure.ConcreteRange]: "ConcreteRange",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isFullRefine(object: unknown): object is RefineResult {
  if (typeof object !== "object") return false;
  return Boolean(object && "Refinement" in object);
}
