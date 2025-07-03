import { useAppSelector } from "@/store";
import { selectIsAssetFiat } from "@/store/wallet";

export const useDeposits = () => {
  const isFiat = useAppSelector(selectIsAssetFiat);

  return {
    isFiat,
  };
};
