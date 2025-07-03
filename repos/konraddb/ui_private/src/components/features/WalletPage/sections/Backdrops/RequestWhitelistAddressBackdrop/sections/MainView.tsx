import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import {
  BackdropTitle,
  InputBase,
  Notification,
  SimpleSelect,
} from "@/components/molecules";
import { WhitelistAddressRequestProps } from "@/services/wallet";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../config";
import { RequestWhitelistAddressBackdropViews } from "../useRequestWhitelistAddressBackdrop";
import { useTranslations } from "../useTranslations";
import { formWrapper, mainWrapperStyles } from "./common.styles";
import { useMainView } from "./useMainView";

interface MainViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
  setCredentials: (credentials: WhitelistAddressRequestProps) => void;
}

const MainView = ({ setView, setCredentials }: MainViewProps) => {
  const { formik, assets, handleCancel, handleSelect } = useMainView({
    setView,
    setCredentials,
  });

  const {
    t,
    addnewWalletAddress,
    addnewWalletAddressMessageEmail,
    currency,
    withdrawalAddress,
    typeWithdrawalAddress,
    whitelistAddressMessage1,
    whitelistAddressMessage2,
    next,
    cancel,
    selectOption,
  } = useTranslations(namespace);
  const getInputProps = createGetInputProps(t, formik, namespace);

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle
        title={addnewWalletAddress}
        subtitle={addnewWalletAddressMessageEmail}
      />

      <Box sx={formWrapper}>
        <SimpleSelect
          options={assets}
          placeholder={selectOption}
          setValue={(val) => handleSelect(val)}
          value={formik.values.currency}
          searchable
          TopLabelProps={{
            LabelProps: { value: currency },
          }}
        />

        <InputBase
          id="address"
          placeholder={typeWithdrawalAddress}
          {...getInputProps("address")}
          TopLabelProps={{
            LabelProps: {
              value: withdrawalAddress,
            },
          }}
        />

        <InputBase
          id="label"
          placeholder="John Savings"
          {...getInputProps("label")}
        />
      </Box>

      <Notification
        variant="info"
        customChildren={
          <Box>
            <Typography variant="body3" display="inline">
              {whitelistAddressMessage1}
            </Typography>
            <Typography
              variant="body3"
              fontWeight="bold"
              ml={0.5}
              display="inline"
            >
              {whitelistAddressMessage2}
            </Typography>
          </Box>
        }
      />

      <Box>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          size="large"
          sx={{ mb: 4 }}
          fullWidth
          disabled={!formik.isValid || !formik.dirty}
        >
          {next}
        </Button>

        <Button onClick={handleCancel} variant="text" size="large" fullWidth>
          {cancel}
        </Button>
      </Box>
    </Box>
  );
};

export default MainView;
