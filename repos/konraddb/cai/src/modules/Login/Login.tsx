import React, { useState } from "react";
import {
  Container,
  InnerBox,
  Title,
  WelcomeText,
  LoginPrompt,
  StyledInput,
  PrimaryButton,
  SecondaryButton,
  FooterText,
  SignUpLink,
} from "./styled";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Divider, Typography } from "@mui/material";
import Google from "@/icons/Google";
import Office from "@/icons/Office";

const LoginModule: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);

  const handleContinueClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleOfficeLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "office365",
      },
    });
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
      },
    });
  };

  return (
    <Container>
      <InnerBox>
        <Title variant="h4">Neutral</Title>
        <WelcomeText>Welcome</WelcomeText>
        <LoginPrompt>Log in to continue.</LoginPrompt>

        <StyledInput placeholder="Email address" />

        <PrimaryButton
          onClick={handleContinueClick}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue"}
        </PrimaryButton>

        <FooterText>
          Don&#39;t have an account?{" "}
          <SignUpLink href="/signup">Sign up</SignUpLink>
        </FooterText>

        <Box display="flex" alignItems="center" mt={2} mb={2} width="100%">
          <Divider sx={{ flexGrow: 1, backgroundColor: "#e0e0e0" }} />
          <Typography variant="body2" color="textSecondary" mx={1}>
            OR
          </Typography>
          <Divider sx={{ flexGrow: 1, backgroundColor: "#e0e0e0" }} />
        </Box>

        <Box
          mt={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <SecondaryButton
            onClick={handleOfficeLogin}
            customVariant="white"
            style={{ marginTop: "8px", width: "100%", gap: 10 }}
          >
            <Office />
            Continue with Office 365
          </SecondaryButton>
          <SecondaryButton
            onClick={handleGoogleLogin}
            customVariant="white"
            style={{ marginTop: "8px", width: "100%", gap: 10 }}
          >
            <Google />
            Continue with Google
          </SecondaryButton>
        </Box>
      </InnerBox>
    </Container>
  );
};

export default LoginModule;
