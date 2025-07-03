import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  InputBase,
  CircularProgress,
} from "@mui/material";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";

interface CustomButtonProps extends MuiButtonProps {
  complete?: boolean;
  isLoading?: boolean;
  disabledLabel?: string | null;
  customVariant?: "white";
}

export const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

export const InnerBox = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  padding: theme.spacing(4),
  borderRadius: "36px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "600px",
}));

export const Title = styled(Typography)({
  fontWeight: "bold",
  fontSize: "2rem",
  marginBottom: "8px",
});

export const WelcomeText = styled(Typography)({
  color: "#666",
  fontSize: "1.5rem",
  fontWeight: "500",
  marginBottom: "8px",
});

export const LoginPrompt = styled(Typography)({
  color: "#666",
  fontSize: "1rem",
  marginBottom: "16px",
});

export const StyledInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  border: `1px solid ${theme.palette.grey[300]}`,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PrimaryButton = styled(
  ({ isLoading, children, ...props }: CustomButtonProps) => (
    <Button {...props}>
      {isLoading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  )
)<CustomButtonProps>(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontWeight: "bold",
  backgroundColor: "#000",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SecondaryButton = styled(
  ({ isLoading, children, ...props }: CustomButtonProps) => (
    <Button {...props}>
      {isLoading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  )
)<CustomButtonProps>(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontWeight: 400,
  fontSize: "0.9rem",
  display: "flex",
  justifyContent: "flex-start",
  backgroundColor: "#ffffff",
  color: "#000",
  border: `1px solid ${theme.palette.grey[300]}`,
  textTransform: "none",
  outline: "none",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&:focus": {
    border: `1px solid ${theme.palette.grey[300]}`,
    outline: "none",
  },
}));

export const FooterText = styled(Box)({
  width: "100%",
  textAlign: "left",
  marginTop: "16px",
  fontSize: "0.875rem",
  color: "#666",
  display: "flex",
  justifyContent: "flex-start",
});

export const SignUpLink = styled("a")({
  color: "#7c7aee",
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});
