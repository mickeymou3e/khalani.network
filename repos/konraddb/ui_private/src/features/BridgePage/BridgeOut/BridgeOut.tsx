import { Stack } from "@mui/material";

import {
  actionAreaContainerStyles,
  formContainerStyles,
} from "./BridgeOut.styles";
import { Form } from "./Form";
import { Summary } from "./Summary";

type BridgeOutProps = {
  children: React.ReactNode;
};

const BridgeOut = ({ children }: BridgeOutProps) => (
  <Stack sx={actionAreaContainerStyles}>
    <Stack sx={formContainerStyles}>
      {children}
      <Form />
    </Stack>

    <Summary />
  </Stack>
);

export default BridgeOut;
