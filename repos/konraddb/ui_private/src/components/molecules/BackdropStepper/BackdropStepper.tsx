import ImageIcon from "@mui/icons-material/Image";
import Box from "@mui/material/Box";

import { IconButton } from "@/components/atoms";

export interface BackdropStepperProps {
  steps: any;
  currentValue: string;
}

const BackdropStepper = ({ steps, currentValue }: BackdropStepperProps) => (
  <Box display="flex" gap={8}>
    {(Object.keys(steps) as Array<keyof typeof steps>).map(
      (step: any, index) => {
        const indexOfCurrentValue = Object.keys(steps).indexOf(currentValue);

        return (
          <IconButton
            variant="contained"
            key={`element-${step}`}
            sx={{
              padding: "0.875rem",
            }}
            disabled={indexOfCurrentValue < index}
            color={indexOfCurrentValue <= index ? "primary" : "success"}
          >
            <ImageIcon />
          </IconButton>
        );
      }
    )}
  </Box>
);

export default BackdropStepper;
