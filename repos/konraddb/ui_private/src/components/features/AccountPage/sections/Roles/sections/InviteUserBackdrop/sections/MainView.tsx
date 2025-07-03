import { useTranslation } from "next-i18next";

import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import { namespace } from "@/components/features/WalletPage/sections/Withdrawals/config";
import { BackdropTitle, InputBase, SimpleSelect } from "@/components/molecules";
import { createGetInputProps } from "@/utils/formik";

import { rolesList } from "../config";
import {
  InviteUserBackdropViews,
  useInviteUserBackdrop,
} from "../useInviteUserBackdrop";
import { formWrapper, mainWrapperStyles } from "./common.styles";
import { useMainView } from "./useMainView";

interface MainViewProps {
  setView: (view: InviteUserBackdropViews) => void;
}

const MainView = ({ setView }: MainViewProps) => {
  const { t } = useTranslation(namespace);
  const { formik, handleSecondaryButtonClick, handleSelect } = useMainView({
    setView,
  });

  const {
    mainViewTitle,
    mainViewSubtitle,
    email,
    role,
    mainViewPrimaryButton,
    mainViewSecondaryButton1,
  } = useInviteUserBackdrop();

  const getInputProps = createGetInputProps(t, formik, namespace);

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle title={mainViewTitle} subtitle={mainViewSubtitle} />

      <Box sx={formWrapper}>
        <InputBase
          id="email"
          placeholder="john.doe@mail.com"
          {...getInputProps("email")}
          TopLabelProps={{
            LabelProps: {
              value: email,
            },
          }}
        />

        <SimpleSelect
          options={rolesList}
          setValue={(val) => handleSelect(val)}
          value={formik.values.userRole}
          TopLabelProps={{
            LabelProps: { value: role },
          }}
        />
      </Box>

      <Box width="100%">
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          size="large"
          sx={{ mb: 4 }}
          fullWidth
          disabled={!formik.isValid || !formik.dirty}
          type="submit"
        >
          {mainViewPrimaryButton}
        </Button>

        <Button
          onClick={handleSecondaryButtonClick}
          variant="text"
          size="large"
          fullWidth
        >
          {mainViewSecondaryButton1}
        </Button>
      </Box>
    </Box>
  );
};

export default MainView;
