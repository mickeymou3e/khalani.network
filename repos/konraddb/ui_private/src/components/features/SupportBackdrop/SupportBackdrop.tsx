import { Box } from "@mui/material";

import { MainSection, SuccessSection } from "./sections";
import { backdropWrapper } from "./SupportBackdrop.styles";
import {
  SupportBackdropSections,
  useSupportBackdropContents,
} from "./useSupportBackdropContents";

type SupportBackdropProps = {
  initialSection?: SupportBackdropSections;
};

const SupportBackdrop = ({
  initialSection = SupportBackdropSections.Main,
}: SupportBackdropProps) => {
  const { section, handleSubmit } = useSupportBackdropContents(initialSection);

  return (
    <Box sx={backdropWrapper}>
      {section === SupportBackdropSections.Main && (
        <MainSection onSubmit={handleSubmit} />
      )}
      {section === SupportBackdropSections.Success && <SuccessSection />}
    </Box>
  );
};

export default SupportBackdrop;
