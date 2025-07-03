import { Gauge, Registry } from "prom-client";

export const JOB_NAME = "wallet-balance-monitor";

export const walletBalanceMonitorMetricsRegister = new Registry();

export const walletBalanceGauge = new Gauge({
  name: 'monitor_wallet_balance',
  help: 'Current ETH balance of wallets',
  registers: [walletBalanceMonitorMetricsRegister],
  labelNames: [
    'chain',
    'wallet_name',
    'wallet_address'
  ],
});

walletBalanceMonitorMetricsRegister.registerMetric(walletBalanceGauge);