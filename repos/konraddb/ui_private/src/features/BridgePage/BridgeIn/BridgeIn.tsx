import { Stack } from "@mui/material";

import {
  actionAreaContainerStyles,
  formContainerStyles,
} from "./BridgeIn.styles";
import { Form } from "./Form";
import { Summary } from "./Summary";

type BridgeInProps = {
  children: React.ReactNode;
};

const BridgeIn = ({ children }: BridgeInProps) => (
  <Stack sx={actionAreaContainerStyles}>
    <Stack sx={formContainerStyles}>
      {children}
      <Form />
    </Stack>

    <Summary />
  </Stack>
);

export default BridgeIn;
