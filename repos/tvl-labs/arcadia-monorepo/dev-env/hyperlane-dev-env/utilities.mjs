#!/usr/bin/env node

import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const registryDir = path.resolve(process.cwd(), "deployments");

export function loadHyperlaneContractAddresses(chainName) {
  const addrPath = path.resolve(
    registryDir,
    "chains",
    chainName,
    "addresses.yaml"
  );
  console.log("Loading addresses.yaml from:", addrPath);
  const file = fs.readFileSync(addrPath, "utf8");
  return yaml.load(file);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getHubContractAddresses() {
  const projectRoot = path.resolve(__dirname);
  const coreBroadcastPath = path.join(projectRoot, '..', '..', 'contracts', 'broadcast', 'HubDeployCoreProtocol.s.sol', '31337', 'run-latest.json');
  const bridgeBroadcastPath = path.join(projectRoot, '..', '..', 'contracts', 'broadcast', 'HubDeployHyperFlowBridge.s.sol', '31337', 'run-latest.json');

  if (!fs.existsSync(coreBroadcastPath)) {
    throw new Error(`Core broadcast file not found at ${coreBroadcastPath}`);
  }

  if (!fs.existsSync(bridgeBroadcastPath)) {
    throw new Error(`Bridge broadcast file not found at ${bridgeBroadcastPath}`);
  }

  let coreBroadcastData;
  let bridgeBroadcastData;

  try {
    const coreData = fs.readFileSync(coreBroadcastPath, 'utf8');
    coreBroadcastData = JSON.parse(coreData);
  } catch (error) {
    throw new Error(`Failed to read or parse core broadcast file: ${error.message}`);
  }

  try {
    const bridgeData = fs.readFileSync(bridgeBroadcastPath, 'utf8');
    bridgeBroadcastData = JSON.parse(bridgeData);
  } catch (error) {
    throw new Error(`Failed to read or parse bridge broadcast file: ${error.message}`);
  }

  const hubContractAddresses = {};

  const coreTransactions = coreBroadcastData.transactions || [];
  for (const tx of coreTransactions) {
    if (tx.transactionType === 'CREATE') {
      switch (tx.contractName) {
        case 'MTokenManager':
          hubContractAddresses.m_token_manager_address = ethers.utils.getAddress(tx.contractAddress);
          break;
        case 'IntentBook':
          hubContractAddresses.intent_book_address = ethers.utils.getAddress(tx.contractAddress);
          break;
        case 'ReceiptManager':
          hubContractAddresses.receipt_manager_address = ethers.utils.getAddress(tx.contractAddress);
          break;
        case 'HubPublisher':
          hubContractAddresses.hub_publisher_address = ethers.utils.getAddress(tx.contractAddress);
          break;
        case 'HubHandler':
          hubContractAddresses.hub_handler_address = ethers.utils.getAddress(tx.contractAddress);
          break;
        case 'MockInterchainGasPaymaster':
          hubContractAddresses.igp_address = ethers.utils.getAddress(tx.contractAddress);
          break;
      }
    }
  }

  const bridgeTransactions = bridgeBroadcastData.transactions || [];
  for (const tx of bridgeTransactions) {
    if (tx.transactionType === 'CREATE' && tx.contractName === 'MTokenCrossChainAdapter') {
      hubContractAddresses.m_token_cross_chain_adapter_address = ethers.utils.getAddress(tx.contractAddress);
      break;
    }
  }

  const expectedContracts = [
    'm_token_manager_address',
    'intent_book_address',
    'receipt_manager_address',
    'hub_publisher_address',
    'hub_handler_address',
    'igp_address',
    'm_token_cross_chain_adapter_address'
  ];

  const foundContracts = Object.keys(hubContractAddresses);
  const missingContracts = expectedContracts.filter(contract => !foundContracts.includes(contract));

  if (missingContracts.length > 0) {
    throw new Error(`Not all required hub contracts found in broadcast files. Missing: ${missingContracts.join(', ')}`);
  }

  return hubContractAddresses;
}

