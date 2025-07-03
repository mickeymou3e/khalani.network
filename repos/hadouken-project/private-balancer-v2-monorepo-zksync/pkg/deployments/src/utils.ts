import path from 'path';
import fs from 'fs';
import zkSyncTestnetDeployments from '../../config/src/deployments/deployments.zksync-testnet.json';
import zkSyncMainnetDeployments from '../../config/src/deployments/deployments.zksync-mainnet.json';

export function existsFile(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

export function existsDir(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

export function dirAt(base: string, name: string, ensure = true): string {
  const dirPath = path.join(base, name);
  if (ensure && !existsDir(dirPath)) throw Error(`Could not find a directory at ${dirPath}`);
  return dirPath;
}

export function fileAt(base: string, name: string, ensure = true): string {
  const filePath = path.join(base, name);
  if (ensure && !existsFile(filePath)) throw Error(`Could not find a file at ${filePath}`);
  return filePath;
}

export function write<T>(path: string, output: T): void {
  const timestamp = new Date().getTime();
  const finalOutputJSON = JSON.stringify({ ...output, timestamp }, null, 2);
  fs.writeFileSync(path, finalOutputJSON);
}

export function save<T>(output: T, name: string, dirBase: string, network: string): void {
  const outputDir = dirAt(dirBase, 'output', false);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const timestamp = `${String(Math.floor(Date.now() / 1000))}-${name}`;
  const timestampOutputDir = dirAt(outputDir, timestamp, false);
  if (!fs.existsSync(timestampOutputDir)) fs.mkdirSync(timestampOutputDir);

  const taskOutputFile = fileAt(timestampOutputDir, `${network}.json`, false);

  const finalOutput = { ...output };
  write<T>(taskOutputFile, finalOutput);
}

export function saveDeploymentAddress(contractName: string, contractAddress: string): void {
  const currentFilePath = path.resolve(__dirname);
  const configFolderPath = path.join(currentFilePath, '../../config/src/deployments');
  const filePath = path.join(configFolderPath, 'deployments.zksync-testnet.json');

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }

  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const parsedFileLines = JSON.parse(file);

  const newLines = {
    ...parsedFileLines,
    [contractName]: contractAddress,
  };

  fs.writeFileSync(filePath, JSON.stringify(newLines));
}

export const getDeploymentAddress = (network: string) => {
  if (network === 'zkTestnet') {
    return zkSyncTestnetDeployments;
  } else if (network === 'zkMainnet') {
    return zkSyncMainnetDeployments;
  } else {
    throw new Error('Cannot find deployment addresses');
  }
};

export const getDeploymentAddressCli = (network: string) => {
  if (network === 'zksync-testnet') {
    return zkSyncTestnetDeployments;
  } else if (network === 'zksync-mainnet') {
    return zkSyncMainnetDeployments;
  } else {
    throw new Error('Cannot find deployment addresses');
  }
};
