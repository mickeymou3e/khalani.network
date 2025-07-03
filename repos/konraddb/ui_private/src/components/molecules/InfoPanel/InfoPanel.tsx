import { Stack, StackProps } from "@mui/material";

import InfoPanelEntry, { InfoPanelEntryProps } from "./InfoPanelEntry";

export type InfoPanelProps = {
  content: InfoPanelEntryProps[];
} & StackProps;

const InfoPanel = ({ content, ...rest }: InfoPanelProps) => (
  <Stack {...rest}>
    {content.map((entry, index) => (
      <InfoPanelEntry key={index} {...entry} />
    ))}
  </Stack>
);

export default InfoPanel;
