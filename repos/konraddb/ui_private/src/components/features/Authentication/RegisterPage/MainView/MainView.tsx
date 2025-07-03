import { FormikProps } from "formik";

import { Box, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import {
  InfoPopover,
  InputBase,
  PasswordInput,
  PasswordStrengthIndicator,
  StaticFormItem,
} from "@/components/molecules";

import { RegisterFormProps } from "../useRegisterPage";
import {
  containerStyle,
  innerContainerStyle,
  titleStyle,
} from "./MainView.styles";
import { useMainView } from "./useMainView";

type MainViewProps = {
  formik: FormikProps<RegisterFormProps>;
  onNextView: () => void;
};

const MainView = ({ formik, onNextView }: MainViewProps) => {
  const {
    signupTitle,
    firstNameLabel,
    firstNamePlaceholder,
    emailLabel,
    passwordLabel,
    passwordPlaceholder,
    confirmPasswordLabel,
    confirmPasswordPlaceholder,
    actionButtonDisabled,
    nextButtonLabel,
    passwordHintText,
    formattedEmail,
    getInputProps,
  } = useMainView(formik);

  return (
    <Box sx={containerStyle}>
      <Typography
        sx={titleStyle}
        component="h5"
        variant="h5"
        alignSelf="center"
      >
        {signupTitle}
      </Typography>

      <Box sx={innerContainerStyle}>
        <InputBase
          id="firstName"
          placeholder={firstNamePlaceholder}
          {...getInputProps("firstName")}
          TopLabelProps={{
            LabelProps: {
              value: firstNameLabel,
            },
          }}
        />

        <StaticFormItem label={emailLabel} placeholder={formattedEmail} />

        <PasswordInput
          id="password"
          placeholder={passwordPlaceholder}
          {...getInputProps("password")}
          TopLabelProps={{
            LabelProps: {
              value: passwordLabel,
            },
            SecondaryLabelProps: {
              value: (
                <Box display="flex" alignItems="center">
                  <PasswordStrengthIndicator
                    password={formik.values.password}
                  />
                  <InfoPopover>
                    <Typography variant="body2" color="primary.gray2">
                      {passwordHintText}
                    </Typography>
                  </InfoPopover>
                </Box>
              ),
            },
          }}
        />
        <PasswordInput
          id="confirmPassword"
          placeholder={confirmPasswordPlaceholder}
          {...getInputProps("confirmPassword")}
          TopLabelProps={{
            LabelProps: {
              value: confirmPasswordLabel,
            },
          }}
        />

        <Button
          variant="contained"
          size="large"
          disabled={actionButtonDisabled}
          fullWidth
          onClick={onNextView}
        >
          {nextButtonLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default MainView;
