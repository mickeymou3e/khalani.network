import { Backdrops } from "@/definitions/types";
import { selectBalancesResultData } from "@/services/balances";
import { useAppDispatch, useAppSelector } from "@/store";
import { openBackdrop } from "@/store/backdrops";
import { selectSelectedAssetAvailableBalance } from "@/store/balances";
import {
  selectCryptoDepositAddress,
  selectIsAssetFiat,
  selectSelectedAsset,
  setSelectedAsset,
} from "@/store/wallet";

const createAssetValues = ({ code, name }: { code: string; name: string }) => ({
  value: code,
  assets: [
    {
      icon: code,
      label: code,
      description: name,
    },
  ],
});

export const useDepositsSelectors = () => {
  const dispatch = useAppDispatch();

  const assets = useAppSelector(selectBalancesResultData);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedAssetBalance = useAppSelector(
    selectSelectedAssetAvailableBalance
  );
  const isFiat = useAppSelector(selectIsAssetFiat);
  const depositAddress = useAppSelector(selectCryptoDepositAddress);

  const assetsProvider = assets.map(createAssetValues);

  const handleSelect = (value: any) => {
    dispatch(setSelectedAsset(value));
  };

  const handleContactSupport = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return {
    assetsProvider,
    selectedAsset,
    selectedAssetBalance,
    depositAddress,
    isFiat,
    handleSelect,
    handleContactSupport,
  };
};
