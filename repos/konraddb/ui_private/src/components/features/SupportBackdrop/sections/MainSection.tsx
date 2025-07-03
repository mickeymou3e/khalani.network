import { Box, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { InputBase } from "@/components/molecules";

import { namespace } from "../config";
import { getInputProps } from "./MainSection.helpers";
import {
  contentWrapper,
  formWrapper,
  headingWrapper,
  sendButtonStyle,
} from "./MainSection.styles";
import { useMainSection } from "./useMainSection";

const MainSection = ({ onSubmit }: { onSubmit: () => void }) => {
  const {
    t,
    formik,
    submitButtonDisabled,
    shouldDisableSubject,
    handleCancel,
  } = useMainSection(onSubmit);

  return (
    <Box sx={contentWrapper}>
      <Box sx={headingWrapper}>
        <Typography variant="h5">{t(`${namespace}:title`)}</Typography>
        <Typography variant="subtitle" color="primary.gray2" textAlign="center">
          {t(`${namespace}:description`)}
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={formWrapper}>
          <InputBase
            id="email"
            placeholder="john.doe@mail.com"
            {...getInputProps(t, formik, "email")}
          />
          <InputBase
            id="subject"
            placeholder={t(`${namespace}:typeSubject`) ?? ""}
            disabled={shouldDisableSubject}
            {...getInputProps(t, formik, "subject")}
          />
          <InputBase
            id="message"
            multiline
            rows={4}
            placeholder={t(`${namespace}:typeMessage`) ?? ""}
            {...getInputProps(t, formik, "message")}
          />
          <Button
            sx={sendButtonStyle}
            variant="contained"
            size="large"
            type="submit"
            fullWidth
            disabled={submitButtonDisabled}
          >
            {t(`${namespace}:send`)}
          </Button>
          <Button variant="text" size="large" fullWidth onClick={handleCancel}>
            {t(`${namespace}:cancel`)}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MainSection;
