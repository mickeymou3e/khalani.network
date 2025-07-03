import { createSelector } from "@reduxjs/toolkit";

import { UserRole } from "@/definitions/types";
import {
  selectDltApiTokens,
  selectUserProfile,
} from "@/services/account/account.api";

import { selectSelectedAsset } from "../wallet";

export const selectUserIbans = createSelector(
  [selectUserProfile, selectSelectedAsset],
  (userProfile, selectedAsset) => {
    const ibans = userProfile?.client?.ibans || [];

    return ibans.filter((iban) => iban.currency === selectedAsset);
  }
);

export const selectNeutralClient = createSelector(
  selectUserProfile,
  (userProfile) => userProfile?.client
);

export const selectNeutralClientCode = createSelector(
  selectNeutralClient,
  (neutralClient) => neutralClient?.code
);

export const selectNeutralCustomerCode = createSelector(
  selectUserProfile,
  (neutralClient) => neutralClient?.customer_code ?? ""
);

export const selectNeutralUserCode = createSelector(
  selectUserProfile,
  (userProfile) => userProfile?.code ?? ""
);

export const selectApiTokens = createSelector(
  selectDltApiTokens,
  (apiTokens) =>
    apiTokens?.map((apiTokenEntry) => ({
      label: apiTokenEntry.label,
      key: apiTokenEntry.public_key,
    })) || []
);

export const selectIsAdminUser = createSelector(
  selectUserProfile,
  (userProfile) => userProfile?.role === UserRole.Admin
);
