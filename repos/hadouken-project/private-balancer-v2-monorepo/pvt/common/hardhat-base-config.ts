import './skipFoundryTests.ts';
import dotenv from 'dotenv';
import MantleTestnetConfig from '../../chain-config/mantle-testnet.json';
import MantleMainnetConfig from '../../chain-config/mantle-mainnet.json';
import GodwokenTestnetConfig from '../../chain-config/godwoken-testnet.json';
import GodwokenMainnetConfig from '../../chain-config/godwoken-mainnet.json';

dotenv.config({ path: '../../.env' });

type ContractSettings = Record<
  string,
  {
    version: string;
    runs: number;
  }
>;

const contractSettings: ContractSettings = {
  '@balancer-labs/v2-vault/contracts/Vault.sol': {
    version: '0.7.1',
    runs: 500,
  },
  '@balancer-labs/v2-pool-weighted/contracts/LiquidityBootstrappingPoolFactory.sol': {
    version: '0.7.1',
    runs: 200,
  },
  '@balancer-labs/v2-pool-weighted/contracts/managed/ManagedPoolFactory.sol': {
    version: '0.7.1',
    runs: 140,
  },
  '@balancer-labs/v2-pool-weighted/contracts/managed/ManagedPool.sol': {
    version: '0.7.1',
    runs: 140,
  },
  '@balancer-labs/v2-pool-weighted/contracts/test/MockManagedPool.sol': {
    version: '0.7.1',
    runs: 140,
  },
  '@hadouken-project/governance/contracts/lockdrop/HadoukenLockdrop.sol': {
    version: '0.8.19',
    runs: 140,
  },
  '@hadouken-project/governance/contracts/tokens/HadoukenToken.sol': {
    version: '0.8.19',
    runs: 140,
  },
};

type SolcConfig = {
  version: string;
  settings: {
    optimizer: {
      enabled: boolean;
      runs?: number;
    };
  };
};

export const compilers: SolcConfig[] = [
  {
    version: '0.7.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  {
    version: '0.7.1',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
];

export const networks = {
  ['godwoken-mainnet']: {
    chainId: Number(GodwokenMainnetConfig.chainId),
    url: GodwokenMainnetConfig.rpcUrl,
    throwOnCallFailures: true,
    accounts: [process.env.GODWOKEN_DEPLOYER as string],
  },
  ['godwoken-testnet']: {
    chainId: Number(GodwokenTestnetConfig.chainId),
    url: GodwokenTestnetConfig.rpcUrl,
    throwOnCallFailures: true,
    accounts: [process.env.GODWOKEN_DEPLOYER as string],
  },
  ['mantle-mainnet']: {
    chainId: Number(MantleMainnetConfig.chainId),
    url: MantleMainnetConfig.rpcUrl,
    throwOnCallFailures: true,
    accounts: [process.env.MANTLE_DEPLOYER as string],
  },
  ['mantle-testnet']: {
    chainId: Number(MantleTestnetConfig.chainId),
    url: MantleTestnetConfig.rpcUrl,
    throwOnCallFailures: true,
    accounts: [process.env.MANTLE_DEPLOYER as string],
  },
};

export const overrides = (packageName: string): Record<string, SolcConfig> => {
  const overrides: Record<string, SolcConfig> = {};

  for (const contract of Object.keys(contractSettings)) {
    overrides[contract.replace(`${packageName}/`, '')] = {
      version: contractSettings[contract].version,
      settings: {
        optimizer: {
          enabled: true,
          runs: contractSettings[contract].runs,
        },
      },
    };
  }

  return overrides;
};

export const warnings = {
  // Ignore code-size in test files: mocks may make contracts not deployable on real networks, but we don't care about
  // that.
  'contracts/test/**/*': {
    'code-size': 'off',
  },
  // Make all warnings cause errors, except code-size (contracts may go over the limit during development).
  '*': {
    'code-size': 'warn',
    'shadowing-opcode': 'off',
  },
};
