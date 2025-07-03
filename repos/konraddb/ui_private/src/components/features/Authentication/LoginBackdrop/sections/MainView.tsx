import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import {
  BackdropTitle,
  InputBase,
  PasswordInput,
} from "@/components/molecules";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../config";
import { LoginBackdropViews } from "../useLoginBackdropContents";
import { useLoginBackdropTranslations } from "../useLoginBackdropTranslations";
import { inputWrapper, mainWrapperStyles } from "./common.styles";
import { useMainView } from "./useMainView";

interface MainViewProps {
  setView: (view: LoginBackdropViews) => void;
}

const MainView = ({ setView }: MainViewProps) => {
  const { t, login, email, password, enterPassword, next, forgotPassword } =
    useLoginBackdropTranslations(namespace);

  const { formik, handleForgotPassword } = useMainView({
    setView,
  });

  const getInputProps = createGetInputProps(t, formik, namespace);

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle title={login} />

      <form onSubmit={formik.handleSubmit}>
        <Box sx={inputWrapper}>
          <InputBase
            id="email"
            placeholder="john.doe@mail.com"
            {...getInputProps("email")}
            autoFocus
            TopLabelProps={{
              LabelProps: {
                value: email,
              },
            }}
          />
          <PasswordInput
            id="password"
            placeholder={enterPassword}
            {...getInputProps("password")}
            TopLabelProps={{
              LabelProps: {
                value: password,
              },
            }}
          />
        </Box>

        <Box mt={6}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={
              !formik.dirty ||
              (formik.dirty && !formik.isValid) ||
              formik.isSubmitting
            }
            fullWidth
          >
            {next}
          </Button>

          <Button
            onClick={handleForgotPassword}
            size="large"
            sx={{ marginTop: 4 }}
            fullWidth
          >
            {forgotPassword}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MainView;
