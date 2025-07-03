import { FormikProps } from "formik";

import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import { HiddenContent, InputBase, SimpleSelect } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../../config";
import { useWalletWithdrawalTranslations } from "../../useWalletWithdrawalTranslations";
import { AssetSelector } from "./AssetSelector";
import { useWithdrawalsSelectors } from "./useWithdrawalsSelectors";
import { componentWrapperStyles } from "./WithdrawalsSelectors.styles";

interface WithdrawalsSelectorsProps {
  formik: FormikProps<any>;
}

const WithdrawalsSelectors = ({ formik }: WithdrawalsSelectorsProps) => {
  const {
    selectedAssetBalance,
    isFiat,
    withdrawalsAddresses,
    isAddressExists,
    handleUseMaxAmount,
    handleSelectAccount,
  } = useWithdrawalsSelectors({ formik });

  const {
    t,
    selectAddress,
    chooseOptionToReveal,
    walletAddress,
    amount,
    search,
  } = useWalletWithdrawalTranslations(namespace);

  const getInputProps = createGetInputProps(t, formik, namespace);

  return (
    <Box>
      <Box sx={componentWrapperStyles}>
        <AssetSelector formik={formik} />

        {!formik.values.withdrawalAsset && (
          <HiddenContent label={chooseOptionToReveal} height="15rem" />
        )}

        {formik.values.withdrawalAsset && !isFiat && (
          <SimpleSelect
            options={withdrawalsAddresses}
            placeholder={selectAddress}
            setValue={(val) => handleSelectAccount(val)}
            value={formik.values.walletAddress}
            searchable
            searchPlaceholder={search}
            searchSize="small"
            TopLabelProps={{
              LabelProps: { value: walletAddress },
            }}
            showDescription
            type="address"
            disabled={!isAddressExists}
          />
        )}

        {formik.values.withdrawalAsset && (
          <InputBase
            id="amount"
            placeholder={Symbols.ZeroBalance}
            {...getInputProps("amount")}
            TopLabelProps={{
              LabelProps: { value: amount },
            }}
            type="number"
            disabled={!isAddressExists}
            InputProps={{
              endAdornment: (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUseMaxAmount}
                  disabled={
                    !selectedAssetBalance?.assetBalance || !isAddressExists
                  }
                >
                  Max
                </Button>
              ),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default WithdrawalsSelectors;
