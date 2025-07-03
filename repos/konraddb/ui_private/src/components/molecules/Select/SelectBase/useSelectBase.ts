import { useEffect, useState } from "react";

export const useSelectBase = (disabled: boolean) => {
  const [opened, setOpened] = useState(false);
  const [menuMinWidth, setMenuMinWidth] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!anchorEl) return undefined;

    function handleResize() {
      setMenuMinWidth(anchorEl?.clientWidth || 0);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    setOpened(!opened);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpened(false);
    setAnchorEl(null);
  };

  return {
    opened,
    menuMinWidth,
    anchorEl,
    handleClick,
    handleClose,
  };
};
