import { useState } from "react";

export enum CreateBackdropViews {
  Main = "Main",
  Success = "Success",
}

export const useCreateBackdrop = (initialView?: CreateBackdropViews) => {
  const [view, setView] = useState(initialView || CreateBackdropViews.Main);

  return {
    view,
    setView,
  };
};
