import { Stack, Typography } from "@mui/material";

import { Button, Checkbox } from "@/components/atoms";
import { InfoPopover, InputBase } from "@/components/molecules";

import { RetireModalViews } from "../../useRetireModal";
import {
  formWrapper,
  headingWrapper,
  sendButtonStyle,
} from "./RetireCredits.styles";
import { useRetireCredits } from "./useRetireCredits";

export type RetireCreditsProps = {
  setView: (view: RetireModalViews) => void;
};

const RetireCredits = (props: RetireCreditsProps) => {
  const {
    formik,
    submitButtonDisabled,
    title,
    subtitle,
    beneficiaryPlaceholder,
    auditYearPlaceholder,
    reasonPlaceholder,
    greenEAudit,
    retireLabel,
    cancelLabel,
    popoverContent,
    getInputProps,
    handleCancel,
  } = useRetireCredits(props);

  return (
    <Stack>
      <Stack sx={headingWrapper}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="subtitle" color="primary.gray2" textAlign="center">
          {subtitle}
        </Typography>
      </Stack>

      <form onSubmit={formik.handleSubmit}>
        <Stack sx={formWrapper}>
          <InputBase
            id="beneficiary"
            placeholder={beneficiaryPlaceholder}
            {...getInputProps("beneficiary")}
          />
          <InputBase
            id="auditYear"
            placeholder={auditYearPlaceholder}
            {...getInputProps("auditYear")}
          />
          <InputBase
            id="reason"
            multiline
            rows={4}
            placeholder={reasonPlaceholder}
            {...getInputProps("reason")}
          />
          <Stack direction="row" justifyContent="space-between">
            <Checkbox
              id="eAudit"
              label={greenEAudit}
              {...formik.getFieldProps("eAudit")}
            />
            <InfoPopover>
              <Typography color="primary.gray2">{popoverContent}</Typography>
            </InfoPopover>
          </Stack>
          <Button
            sx={sendButtonStyle}
            variant="contained"
            size="large"
            type="submit"
            fullWidth
            disabled={submitButtonDisabled}
          >
            {retireLabel}
          </Button>
          <Button variant="text" size="large" fullWidth onClick={handleCancel}>
            {cancelLabel}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default RetireCredits;
