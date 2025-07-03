import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import { BackdropTitle, InputBase } from "@/components/molecules";
import { createGetInputProps } from "@/utils/formik";

import { formWrapper, mainWrapperStyles } from "./VerifyBackdropView.styles";

export interface VerifyBackdropViewProps {
  handleGetBack?: () => void;
  title: string;
  subtitle: string;
  buttonLabel: string;
  formik: FormikProps<any>;
  namespace: string;
}

const VerifyBackdropView = ({
  handleGetBack,
  title,
  subtitle,
  buttonLabel,
  formik,
  namespace,
}: VerifyBackdropViewProps) => {
  const { t } = useTranslation("common:formsValidations");

  const getInputProps = createGetInputProps(t, formik, namespace);

  const commonNamespace = "common:commonBackdrops";

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle
        handleGetBack={handleGetBack}
        title={title}
        subtitle={subtitle}
      />

      <form onSubmit={formik.handleSubmit}>
        <Box sx={formWrapper}>
          <InputBase
            id="code"
            placeholder={t(`${commonNamespace}:enter6Marks`) || ""}
            {...getInputProps("code")}
            autoFocus
            TopLabelProps={{
              LabelProps: {
                value: t(`${commonNamespace}:authenticatorCode`),
              },
            }}
          />
        </Box>

        <Box width="100%">
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ marginTop: 6, marginBottom: 3 }}
            disabled={
              !formik.dirty ||
              (formik.dirty && !formik.isValid) ||
              formik.isSubmitting
            }
            fullWidth
          >
            {buttonLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default VerifyBackdropView;
