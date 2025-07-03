import { Stack, Typography } from "@mui/material";

export type InfoPanelEntryProps = {
  label: string;
  value?: string;
  component?: React.ReactNode;
};

const InfoPanelEntry = ({ label, value, component }: InfoPanelEntryProps) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography color="primary.main" variant="body2">
      {label}
    </Typography>
    {value && (
      <Typography color="primary.main" variant="body2" fontWeight="bold">
        {value}
      </Typography>
    )}
    {component}
  </Stack>
);

export default InfoPanelEntry;
