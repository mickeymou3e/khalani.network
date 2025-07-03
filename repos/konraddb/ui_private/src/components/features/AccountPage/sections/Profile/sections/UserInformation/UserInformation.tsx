import Image from "next/image";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CandlestickChartOutlinedIcon from "@mui/icons-material/CandlestickChartOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Stack, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { StaticRoutes } from "@/definitions/config";
import { Symbols } from "@/definitions/types";

import {
  containerStyle,
  personStyle,
  rowStyles,
} from "./UserInformation.styles";
import { useUserInformation } from "./useUserInformation";

const UserInformation = () => {
  const {
    isAdmin,
    administratorLabel,
    traderLabel,
    idLabel,
    joinedLabel,
    name,
    email,
    // Note: That section is only temporarily hidden, it will be needed in the future.
    // emailNotificationsEnabled,
    // receiveEmailsLabel,
    // handleChangeEmailNotifications,
    handleVisibility,
  } = useUserInformation();

  return (
    <Box sx={containerStyle}>
      <Box width="100%">
        <Box sx={rowStyles} mb={6}>
          <Image
            src={isAdmin ? StaticRoutes.USER_ADMIN : StaticRoutes.USER_TRADER}
            alt="user-image"
            width="140"
            height="140"
          />
          {/* Note: That section is only temporarily hidden, it will be needed in the future. */}
          {/* <Box display="flex" gap={3}>
            <Button variant="outlined" onClick={handleUploadImage}>
              {uploadLabel}
            </Button>
            <Button variant="text" onClick={handleRemoveImage} disabled>
              {removeLabel}
            </Button>
          </Box> */}
        </Box>

        <Box display="flex" alignItems="center" gap={3} mb={1}>
          <Typography
            variant="button"
            sx={{
              textTransform: "uppercase",
            }}
            color="primary.gray2"
          >
            {idLabel}
          </Typography>
          <IconButton
            size="small"
            onClick={handleVisibility}
            variant="outlined"
          >
            <VisibilityIcon />
          </IconButton>
        </Box>

        <Typography component="h5" variant="h5" mb={6}>
          {name ?? Symbols.NoValue}
        </Typography>

        <Stack flexDirection="column" gap={2} mb={6}>
          <Box sx={personStyle}>
            {isAdmin ? (
              <DiamondOutlinedIcon />
            ) : (
              <CandlestickChartOutlinedIcon />
            )}
            <Typography variant="body2" color="primary.grey3">
              {isAdmin ? administratorLabel : traderLabel}
            </Typography>
          </Box>

          <Box sx={personStyle}>
            <EmailOutlinedIcon />
            <Typography variant="body2" color="primary.grey3">
              {email ?? Symbols.NoValue}
            </Typography>
          </Box>

          <Box sx={personStyle}>
            <CalendarMonthOutlinedIcon />
            <Typography variant="body2" color="primary.grey3">
              {joinedLabel ?? Symbols.NoValue}
            </Typography>
          </Box>
        </Stack>

        {/* Note: That section is only temporarily hidden, it will be needed in the future. */}
        {/* <Stack
          flexDirection="row"
          justifyContent="space-between"
          sx={grayTextWrapperStyles}
        >
          <Typography variant="body2" color="primary.grey3">
            {receiveEmailsLabel}
          </Typography>
          <Switch
            checked={emailNotificationsEnabled}
            onChange={handleChangeEmailNotifications}
          />
        </Stack> */}
      </Box>
    </Box>
  );
};

export default UserInformation;
