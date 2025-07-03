interface AppConfig {
  [key: string]: string;
}

const config: AppConfig = {
  adminRole: process.env.ADMIN_ROLE || "admin",
  traderRole: process.env.TRADER_ROLE || "trader",
};

export default config;
