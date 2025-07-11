import './skipFoundryTests.ts';

type ContractSettings = Record<
  string,
  {
    version: string;
    runs: number;
  }
>;

const contractSettings: ContractSettings = {};

type SolcConfig = {
  version: string;
  settings: {
    optimizer: {
      enabled: boolean;
      runs?: number;
    };
  };
};

export const compilers: [SolcConfig] = [
  {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
];

export const zkSolcCompiler = {
  version: '1.3.9',
  compilerSource: 'binary',
  settings: {
    optimizer: {
      enabled: true,
      mode: 'z',
    },
  },
};

export const zkSyncNetworks = {
  zkLocal: {
    url: 'http://localhost:3050',
    ethNetwork: 'http://localhost:8545',
    zksync: true,
  },
  zkTestnet: {
    url: 'https://testnet.era.zksync.dev',
    ethNetwork: 'goerli',
    zksync: true,
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
  },
  hardhat: {
    zksync: true,
    allowUnlimitedContractSize: true,
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
    default: 'error',
  },
};
