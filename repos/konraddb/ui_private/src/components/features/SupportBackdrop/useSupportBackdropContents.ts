import { useState } from "react";

export enum SupportBackdropSections {
  Main = "Main",
  Success = "Success",
}

export const useSupportBackdropContents = (
  initialSection: SupportBackdropSections
) => {
  const [section, setSection] = useState(initialSection);

  const handleSubmit = () => {
    setSection(SupportBackdropSections.Success);
  };

  return {
    section,
    handleSubmit,
  };
};
