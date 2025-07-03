export const AuthErrorCodes = {
  0: "",
  8000: "",
  604: ":expiredToken",
  7000: ":invalidCredentials",
  9199: ":invalidToken",
  9000: ":expiredToken",
  7101: ":expiredToken",
};

export interface AuthState {
  csrfToken: string | null;
  loginToken: string | null;
  wsToken: string | null;
  errorCode: keyof typeof AuthErrorCodes;
  lastRequestStartTime: number;
  isFullyLoggedIn: boolean;
  isPendingVerification: boolean;
}

export interface NeutralAuthState {
  bearerToken: string | null;
}
