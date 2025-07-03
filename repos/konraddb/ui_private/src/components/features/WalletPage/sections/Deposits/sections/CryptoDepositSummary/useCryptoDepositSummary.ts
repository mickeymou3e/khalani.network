import { useAppSelector } from "@/store";
import {
  selectBlockchainNetwork,
  selectCryptoDepositAddress,
  selectSelectedAsset,
} from "@/store/wallet";

export const useCryptoDepositSummary = () => {
  const cryptoDepositAddress = useAppSelector(selectCryptoDepositAddress);
  const cryptoDepositNetwork = useAppSelector(selectBlockchainNetwork);
  const selectedAsset = useAppSelector(selectSelectedAsset);

  return {
    cryptoDepositAddress,
    cryptoDepositNetwork,
    selectedAsset,
  };
};
