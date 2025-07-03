export const InviteErrorCodes = {
  9000: ":notEnoughPermissions",
  9102: ":duplicateEntity",
  10000: ":invalidEmailWithAction",
  10001: ":invalidEmailWithAction",
};

export type TotpSecretResponse = {
  code: string;
  is_used: string;
  role: string;
  totp_secret: string;
};

export type CreateAccountRequest = {
  email: string;
  name: string;
  invite_code: string;
  password: string;
  totp_code: string;
};

export const CreateAccountErrorCodes = {
  9016: ":inviteNotFound",
  9199: ":invalidTotpCode",
  603: ":invalidTotpCode",
  604: ":invalidTotpCode",
  8000: ":invalidTotpCode",
  9102: ":duplicateEntity",
};

export type CreateAccountResponse = {
  code: keyof typeof CreateAccountErrorCodes;
  value: string;
};
