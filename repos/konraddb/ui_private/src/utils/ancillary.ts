import { AncillaryFeature } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

export const calculateTxSettings = (feature: AncillaryFeature, value = 0) => {
  const multiplier = value - 1;
  const gasLimit =
    evaluate<number>(
      [feature === AncillaryFeature.Pool, 350000 + 50000 * multiplier],
      [feature === AncillaryFeature.Redeem, 250000 + 50000 * multiplier],
      [feature === AncillaryFeature.BridgeIn, 350000],
      [feature === AncillaryFeature.BridgeOut, 350000],
      [feature === AncillaryFeature.Retire, 120000 + 20000 * multiplier],
      [feature === AncillaryFeature.RetirePool, 250000],
    ) ?? 0;

  return {
    gas_limit: gasLimit.toString(),
    gas_price: "",
    max_fee_per_gas: "",
    max_priority_fee_per_gas: "",
  };
};
