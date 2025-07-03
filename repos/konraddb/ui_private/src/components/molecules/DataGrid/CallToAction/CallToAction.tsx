import { Box, Typography } from "@mui/material";

import { Button, SilentGuy } from "@/components/atoms";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch } from "@/store";
import { openBackdrop } from "@/store/backdrops/backdrops.store";

import { containerStyle } from "./CallToAction.styles";

type CallToActionProps = {
  loginText: string;
  actionText?: string;
  iconComponent?: React.ReactNode;
};

const CallToAction = ({
  loginText,
  actionText,
  iconComponent,
}: CallToActionProps) => {
  const dispatch = useAppDispatch();

  const onActionClick = () => {
    dispatch(openBackdrop(Backdrops.LOGIN));
  };

  return (
    <Box sx={containerStyle}>
      {iconComponent ?? <SilentGuy width={72} height={72} />}
      <Typography variant="body2" color="primary.gray2">
        {actionText}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={onActionClick}
      >
        {loginText}
      </Button>
    </Box>
  );
};

export default CallToAction;
