export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  csrfToken: string;
  loginToken: string;
}

export interface TwoFactorAuthRequest {
  totpCode: string;
  csrfToken: string;
  loginToken: string;
}

export interface TwoFactorAuthResponse {
  csrfToken: string;
  wsToken: string;
}

export interface WebsocketTokensResponse {
  public_key: string;
  nonce: number;
  signature: string;
}

export interface NeutralLoginResponse {
  expiresAt: string;
  token: string;
  userCode: string;
  features: {
    [key: string]: boolean;
  };
}
