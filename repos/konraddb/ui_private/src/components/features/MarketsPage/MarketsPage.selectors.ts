import { createSelector } from "@reduxjs/toolkit";

import { PieChartEntry } from "@/components/molecules";
import { selectPoolDeposits } from "@/store/ancillary";
import { selectIsPendingVerification, selectIsValidLogin } from "@/store/auth";
import {
  selectJasmineTechTypeOrder,
  selectJasmineTechTypes,
  selectJasmineVintages,
  VintageProps,
} from "@/store/pool";
import { RenewableEnergyCertificate } from "@/store/pool/pool.types";
import {
  RateData,
  selectAllAssetRateDetails,
  selectUnauthenticatedAssetRateDetails,
} from "@/store/rates";

export type MarketsGridRowDetails = {
  techTypes: PieChartEntry[];
  techTypeOrder: string[];
  vintages: VintageProps[];
  assets: RenewableEnergyCertificate[];
};

export type MarketsGridRowProps = {
  contents?: MarketsGridRowDetails;
} & RateData;

export const selectGridData = createSelector(
  [
    selectAllAssetRateDetails,
    selectUnauthenticatedAssetRateDetails,
    selectPoolDeposits,
    selectJasmineTechTypes,
    selectJasmineTechTypeOrder,
    selectJasmineVintages,
    selectIsPendingVerification,
    selectIsValidLogin,
  ],
  (
    allAssetRateDetails,
    unauthAllAssetRateDetails,
    poolAssets,
    jasmineTechTypes,
    jasmineTechTypeOrder,
    jasmineVintages,
    isPendingVerification,
    isLoggedIn
  ) => {
    const gridData =
      isPendingVerification || isLoggedIn
        ? allAssetRateDetails
        : unauthAllAssetRateDetails;

    return gridData.map((row) => ({
      ...row,
      contents: {
        techTypes: jasmineTechTypes,
        techTypeOrder: jasmineTechTypeOrder,
        vintages: jasmineVintages,
        assets: poolAssets,
      },
    })) as MarketsGridRowProps[];
  }
);
