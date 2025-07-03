import config from "@config";

export const UserRole = {
  Admin: config.adminRole,
  Trader: config.traderRole,
} as const;

export enum AccountPageTabs {
  profile = "profile",
  roles = "roles",
  apiKeys = "apiKeys",
}

export enum ApiKeyTypes {
  Read = "read",
  Trade = "trade",
}
