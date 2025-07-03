"use client";

import { useCallback } from "react";
import {
  mainnet,
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

export const useConnection = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data } = useBalance({ address });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const handleConnectToMetamask = useCallback(() => {
    const metaMaskConnector = connectors.at(0);

    if (!metaMaskConnector) throw new Error("MetaMask connector not found!");

    if (!metaMaskConnector.ready) {
      window.open("https://metamask.io/download", "_newtab");

      return;
    }

    connect({ connector: metaMaskConnector });
  }, [connectors, connect]);

  const handleSwitchNetwork = useCallback(() => {
    switchNetwork?.(mainnet.id);
  }, [switchNetwork]);

  const isConnectedToConnectNetwork = chain?.id === mainnet.id;

  return {
    handleConnectToMetamask,
    handleDisconnect: () => disconnect(),
    handleSwitchNetwork,
    isConnected,
    address,
    nativeTokenBalance: data?.formatted,
    isConnectedToConnectNetwork,
    network: chain?.name,
  };
};
