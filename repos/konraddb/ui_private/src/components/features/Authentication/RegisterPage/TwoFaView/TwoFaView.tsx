import QRCode from "react-qr-code";
import { FormikProps } from "formik";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Box, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { BackdropTitle, InputBase } from "@/components/molecules";

import { RegisterFormProps } from "../useRegisterPage";
import {
  containerStyle,
  iconStyles,
  innerQrCodeWrapper,
  inputStyle,
  qrCodeContainer,
  qrCodeHintStyle,
  qrCodeWrapper,
  signupButtonStyle,
} from "./TwoFaView.styles";
import { useTwoFaView } from "./useTwoFaView";

type TwoFaViewProps = {
  formik: FormikProps<RegisterFormProps>;
  onBack: () => void;
};

const TwoFaView = ({ formik, onBack }: TwoFaViewProps) => {
  const {
    authenticatorTitle,
    authenticatorSubtitle,
    qrCodeText,
    qrCodeValue,
    authenticatorCode,
    authenticatorCodeHint,
    signupButtonText,
    actionButtonDisabled,
    getInputProps,
  } = useTwoFaView(formik);

  return (
    <Box sx={containerStyle}>
      <BackdropTitle
        title={authenticatorTitle}
        subtitle={authenticatorSubtitle}
        handleGetBack={onBack}
      />

      <Box sx={qrCodeContainer}>
        <Typography variant="body1" color="primary.gray2">
          {qrCodeText}
        </Typography>
        <Box sx={qrCodeWrapper}>
          <Box sx={innerQrCodeWrapper}>
            <QRCode size={190} value={qrCodeValue} />
          </Box>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <InputBase
          sx={inputStyle}
          id="twoFaCode"
          placeholder="123456"
          {...getInputProps("twoFaCode")}
          TopLabelProps={{
            LabelProps: {
              value: authenticatorCode,
            },
          }}
        />

        <Box sx={qrCodeHintStyle}>
          <QrCodeScannerIcon sx={iconStyles} />
          <Typography variant="body2" color="primary.gray2">
            {authenticatorCodeHint}
          </Typography>
        </Box>

        <Button
          sx={signupButtonStyle}
          type="submit"
          variant="contained"
          size="large"
          disabled={actionButtonDisabled}
          fullWidth
        >
          {signupButtonText}
        </Button>
      </form>
    </Box>
  );
};

export default TwoFaView;
