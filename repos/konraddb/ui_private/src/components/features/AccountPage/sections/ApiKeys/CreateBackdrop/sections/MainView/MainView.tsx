import CopyToClipboard from "react-copy-to-clipboard";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button, IconButton } from "@/components/atoms";
import { BackdropTitle, InputBase, Notification } from "@/components/molecules";
import { ApiKeyTypes } from "@/definitions/types";
import formatAddress from "@/utils/formatAddress";

import { CreateBackdropViews } from "../../useCreateBackdrop";
import {
  formWrapper,
  mainWrapperStyles,
  privateKeyWrapper,
  radioButton,
} from "./MainView.styles";
import { useMainView } from "./useMainView";

type MainViewProps = {
  setView: (view: CreateBackdropViews) => void;
};

const MainView = ({ setView }: MainViewProps) => {
  const {
    formik,
    createApiKeyLabel,
    createApiKeyDisclaimer,
    labelText,
    labelPlaceholder,
    privateKeyLabel,
    disclaimerLabel,
    nextLabel,
    cancelLabel,
    getInputProps,
    handleCloseBackdrop,
  } = useMainView(setView);

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle
        title={createApiKeyLabel}
        subtitle={createApiKeyDisclaimer}
      />

      <Box sx={formWrapper}>
        <InputBase
          id="name"
          placeholder={labelPlaceholder}
          {...getInputProps("name")}
          TopLabelProps={{
            LabelProps: {
              value: labelText,
            },
          }}
        />
        <Box sx={radioButton}>
          <RadioGroup
            aria-labelledby="radio-buttons-api-key-type"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={ApiKeyTypes.Read}
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label={ApiKeyTypes.Trade}
            />
          </RadioGroup>
        </Box>
        <Box sx={privateKeyWrapper}>
          <Typography variant="body2">{privateKeyLabel}</Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatAddress(formik.values.privateKeyValue, 16, 12)}
          </Typography>
          <CopyToClipboard text={formik.values.privateKeyValue}>
            <IconButton
              variant="translucent"
              size="small"
              complete
              disabledIcon={<CheckOutlinedIcon />}
            >
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </Box>
      </Box>

      <Notification variant="info" primaryText={disclaimerLabel} />

      <Box width="100%">
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          size="large"
          fullWidth
          sx={{ marginBottom: 3 }}
          disabled={
            !formik.dirty ||
            (formik.dirty && !formik.isValid) ||
            formik.isSubmitting
          }
        >
          {nextLabel}
        </Button>

        <Button
          onClick={handleCloseBackdrop}
          variant="text"
          size="large"
          fullWidth
        >
          {cancelLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default MainView;
