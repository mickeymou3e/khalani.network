import { ScriptRunEnvironment } from './types';
import { transactionOverrides } from './constants';
import { Network } from '../src/types';
import dotenv from 'dotenv';
import { Provider, Wallet } from 'zksync-web3';

dotenv.config({ path: '../../.env' });

interface ZkSyncConfig {
  [key: string]: string;
}

const RPC_URLS: ZkSyncConfig = {
  'zksync-testnet': 'https://testnet.era.zksync.dev',
  'zksync-mainnet': 'https://mainnet.era.zksync.io',
};

const CHAIN_IDS = {
  'zksync-testnet': '0x118',
  'zksync-mainnet': '0x144',
};

const setupScriptRunEnvironment = async (network: Network): Promise<ScriptRunEnvironment> => {
  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) throw new Error('Missing private key');

  const unconnectedWallet = new Wallet(privateKey);

  const url = RPC_URLS[network];

  const provider = new Provider(url);
  const chainId = CHAIN_IDS[network];

  const deployer = unconnectedWallet.connect(provider);

  return {
    network,
    deployer,
    transactionOverrides,
    chainId,
  };
};

export default setupScriptRunEnvironment;
