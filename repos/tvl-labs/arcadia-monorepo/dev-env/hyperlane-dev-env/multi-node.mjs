#!/usr/bin/env node
// SPDX-Identifier: MIT
// ----------------------------------------------------------
// Spins up three Anvil chains and deploys Hyperlane Core onto
// each of them without any interactive CLI prompts.
// ----------------------------------------------------------

import { execa } from "execa";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { ethers, Wallet, providers } from "ethers";
import {
  MultiProvider,
  HyperlaneCoreDeployer,
  HyperlaneIsmFactory,
} from "@hyperlane-xyz/sdk";
import { objMap } from "@hyperlane-xyz/utils";
import { fileURLToPath } from "url";
import "dotenv/config";
import { cwd, stderr } from "process";
import { loadHyperlaneContractAddresses } from "./utilities.mjs";

const deployDir = path.resolve("./deployments");
fs.mkdirSync(deployDir, { recursive: true });

// ---------- 1. Local-chain definitions ----------
const nodes = [
  {
    name: "anvil1",
    port: 8545,
    chainId: 31337,
    dataDir: ".anvil/arcadialocal",
  },
  { name: "anvil2", port: 8546, chainId: 31338, dataDir: ".anvil/spokelocal1" },
  { name: "anvil3", port: 8547, chainId: 31339, dataDir: ".anvil/spokelocal2" },
];

// Use the standard foundry mnemonic so accounts are deterministic
const mnemonic = "test test test test test test test test test test test junk";

// ---------- 2. Start Anvil processes ----------
console.log("⛓  Booting Anvil nodes …");
const anvilProcs = nodes.map(({ port, chainId, dataDir }) =>
  execa(
    "anvil",
    [
      "--port",
      port,
      "--chain-id",
      chainId,
      "--mnemonic",
      `"${mnemonic}"`,
      "--host",
      "127.0.0.1",
      "--fork-url",
      process.env.FORK_URL,
      "--state",
      dataDir,
    ],
    { stdio: "inherit", shell: true }
  )
);

anvilProcs.forEach((proc, index) => {
  console.log(`Anvil node ${index + 1} PID: ${proc.pid}`);
});

// Kill children when we exit
process.on("SIGINT", () => {
  anvilProcs.forEach((p) => p.kill());
  process.exit(0);
});

// Wait ~3 seconds so JSON-RPCs are ready
await new Promise((r) => setTimeout(r, 3000));

// ---------- 3. Load Hyperlane config ----------
const rawCfg = yaml.load(
  fs.readFileSync(path.resolve("hyperlane-config.yaml"), "utf8")
);

// ---------- 4. Prepare MultiProvider ----------
const key =
  process.env.HYP_KEY ?? // honour CLI env-var
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // dev key from mnemonic[0]

const chainMetadata = /** @type {ChainMap<ChainMetadata>} */ (
  objMap(rawCfg.chains, (k, c) => ({
    ...c,
    name: k,
    domainId: c.domainId ?? c.chainId,
    protocol: "ethereum",
  }))
);

console.log("🔎  Chain metadata is", chainMetadata);

const providerMap = objMap(
  chainMetadata,
  (_k, m) => new providers.JsonRpcProvider(m.rpcUrls[0].http)
);

const signerMap = objMap(
  chainMetadata,
  (k, _m) => new Wallet(key, providerMap[k])
);

let multiProvider = new MultiProvider(chainMetadata, {
  providers: providerMap,
  signers: signerMap,
});

const multiChainMeta = multiProvider.getChainMetadata(
  rawCfg.chains.arcadialocal.name
);
console.log("🔎  MultiProvider chain metadata is", multiChainMeta);
const chainName = multiProvider.getChainName(
  rawCfg.chains.arcadialocal.domainId
);
console.log("✅  Chain name is", chainName);
const multiSigner = multiProvider.signers;
console.log("🔎  MultiProvider signers is", multiSigner);
const sigOrProv = multiProvider.getSignerOrProvider(
  rawCfg.chains.arcadialocal.name
);
console.log("🔎  MultiProvider signer or provider is", sigOrProv);

// ---------- 5. Merge global defaults ----------
// Merge the YAML’s global defaults into a per-chain map keyed exactly
// by the chain names expected by MultiProvider.
const ownerAddr = rawCfg.owner;
let coreConfig = objMap(rawCfg.chains, () => ({
  owner: ownerAddr,
  defaultIsm: rawCfg.defaultIsm,
  defaultHook: rawCfg.defaultHook,
  requiredHook: {
    ...rawCfg.requiredHook,
    owner: ownerAddr,
  },
}));
// ---------- 6. Deploy Hyperlane Core ----------
console.log("🚀  Deploying Hyperlane Core to three local chains …");

const emptyIsmMap = Object.fromEntries(
  Object.keys(chainMetadata).map((k) => [k, {}])
);
const ismFactory = new HyperlaneIsmFactory(emptyIsmMap, multiProvider);

console.log(" Core config: ", coreConfig);
const deployer = new HyperlaneCoreDeployer(multiProvider, ismFactory);

const registryDir = path.resolve("./deployments");
//fs.mkdirSync(path.join(registryDir, 'core'), { recursive: true });
fs.mkdirSync(path.join(registryDir, "chains"), { recursive: true });

console.log("📝  Wrote core/ + chains/ to", registryDir);
console.log("Deploy dir is", deployDir);
const contractsMap = await deployer.deploy(coreConfig);
const chains = Object.keys(chainMetadata);
chains.forEach((chain) => {
  fs.mkdirSync(path.join(registryDir, "chains", chain), { recursive: true });
});

Object.entries(contractsMap).forEach(([chain, contracts]) => {
  fs.writeFileSync(
    path.join(registryDir, "chains", chain, "addresses.yaml"),
    yaml.dump(addressesMap(contracts), { noRefs: true })
  );

  fs.writeFileSync(
    path.join(registryDir, "chains", chain, "metadata.yaml"),
    yaml.dump(chainMetadata[chain], { noRefs: true })
  );
});

console.log("✅  All done – Hyperlane contracts live on ports 8545/6/7");

await deployHubPermissioningSystem("arcadialocal", rawCfg.chains.arcadialocal);
await new Promise((r) => setTimeout(r, 2000));

await deployHubCoreContracts("arcadialocal", rawCfg.chains.arcadialocal);
await new Promise((r) => setTimeout(r, 2000));
await deploySpokeCoreContracts(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await deployHubBridgeAdapter("arcadialocal", rawCfg.chains.arcadialocal);
await new Promise((r) => setTimeout(r, 2000));
await deploySpokeBridgeAdapter(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await connectHubProverToVerifier(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

// await new Promise((r) => setTimeout(r, 2000));
// await connectSpokeProverToHubVerifier('spokelocal1', rawCfg.chains.spokelocal1, rawCfg.chains.arcadialocal.domainId);

await new Promise((r) => setTimeout(r, 2000));
await connectHubVerifierToSpokeProver(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await connectSpokeVerifierToHubProver(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await registerEventsOnSpokeChain(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await registerEventsonHubChain(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await setSpokeGasPrices(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await setHubGasPrices(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await authorizeUSDCOnAssetReserves(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await mintUSDCOnSpoke(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await authorizeUSDTOnAssetReserves(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await createUSDCSpokeMToken(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await createUSDTSpokeMToken(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal1.domainId
);

await new Promise((r) => setTimeout(r, 2000));
await deploySpokeCoreContracts(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await deploySpokeBridgeAdapter(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await connectHubProverToVerifier(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);
// await new Promise((r) => setTimeout(r, 2000));
// await connectSpokeProverToHubVerifier('spokelocal2', rawCfg.chains.spokelocal2, rawCfg.chains.arcadialocal.domainId);
await new Promise((r) => setTimeout(r, 2000));
await connectHubVerifierToSpokeProver(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await connectSpokeVerifierToHubProver(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await registerEventsOnSpokeChain(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await registerEventsonHubChain(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await setSpokeGasPrices(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await setHubGasPrices(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await authorizeUSDCOnAssetReserves(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await mintUSDCOnSpoke(
  "spokelocal1",
  rawCfg.chains.spokelocal1,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await authorizeUSDTOnAssetReserves(
  "spokelocal2",
  rawCfg.chains.spokelocal2,
  rawCfg.chains.arcadialocal.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await createUSDCSpokeMToken(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);
await new Promise((r) => setTimeout(r, 2000));
await createUSDTSpokeMToken(
  "arcadialocal",
  rawCfg.chains.arcadialocal,
  rawCfg.chains.spokelocal2.domainId
);

const relayerKey = key;

const relayer = execa(
  "npx",
  [
    "hyperlane",
    "relayer",
    "--registry",
    deployDir,
    "--chains",
    `'${chains.join(", ")}'`,
    "--key",
    `${relayerKey}`,
  ],
  {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, RELAYER_KEY: relayerKey },
  }
);

console.log("🚚  Relayer started for", chains.join(", "));

// ensure the relayer dies with Ctrl-C
process.on("SIGINT", () => {
  relayer.kill();
  anvilProcs.forEach((p) => p.kill());
  process.exit(0);
});

const chainNames = { arcadialocal: true, spokelocal1: true, spokelocal2: true };

function addressesMap(contracts) {
  return Object.fromEntries(
    Object.entries(contracts).map(([name, contract]) => [
      name,
      contract.address,
    ])
  );
}

/*
Required Env Vars:
- HUB_MAILBOX
- MEDUSA
- MEDUSA_KEY
- REFUND_AGENT
- DEV_MODE = 1
*/

function deployHubPermissioningSystem(chainName, chainMetadata) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/DeployPermissions.s.sol:DeployPermissions"
      ),

      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: { ...process.env },
    }
  );
}

function deployHubCoreContracts(chainName, chainMetadata) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  console.log("ENV", process.env);
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubDeployCoreProtocol.s.sol:HubDeployCoreProtocol"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: { ...process.env, HUB_MAILBOX: hub_mailbox },
    }
  );
}

function deploySpokeCoreContracts(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const spokeMailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeDeployCoreProtocol.s.sol:SpokeDeployCoreProtocol"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        SPOKE_MAILBOX: spokeMailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function deployHubBridgeAdapter(chainName, chainMetadata) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubDeployHyperFlowBridge.s.sol:HubDeployHyperFlowBridge"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: { ...process.env, HUB_MAILBOX: hub_mailbox },
    }
  );
}

function deploySpokeBridgeAdapter(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const spokeMailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeDeployHyperFlowBridge.s.sol:SpokeDeployHyperFlowBridge"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        SPOKE_MAILBOX: spokeMailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function connectHubProverToVerifier(chainName, chainMetadata, spokeChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubConnectProverToVerifier.s.sol:HubConnectProverToVerifier"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
      },
    }
  );
}

function connectSpokeProverToHubVerifier(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const spokeMailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeConnectProverToVerifier.s.sol:SpokeConnectProverToVerifier"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.DEPLOYER_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        SPOKE_MAILBOX: spokeMailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function connectHubVerifierToSpokeProver(
  chainName,
  chainMetadata,
  spokeChainId
) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubConnectRemoteProver.s.sol:HubConnectRemoteProver"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.DEPLOYER_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
      },
    }
  );
}

function connectSpokeVerifierToHubProver(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeConnectRemoteProver.s.sol:SpokeConnectRemoteProver"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.DEPLOYER_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function registerEventsOnSpokeChain(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeBridgeEventRegistration.s.sol:SpokeBridgeEventRegistration"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.DEPLOYER_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function registerEventsonHubChain(chainName, chainMetadata, spokeChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubBridgeEventRegistration.s.sol:HubBridgeEventRegistration"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.DEPLOYER_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
      },
    }
  );
}

function setSpokeGasPrices(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeSetGasAmount.s.sol:SpokeSetGasAmount"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
      },
    }
  );
}

function setHubGasPrices(chainName, chainMetadata, spokeChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  return execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/HubSetGasAmount.s.sol:HubSetGasAmount"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
      },
    }
  );
}

function authorizeUSDCOnAssetReserves(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  const assetAddress = process.env.USDC;
  return execa(
    "forge",
    [
      "script",
      path.resolve("../../contracts/scripts/SpokeAddAsset.s.sol:SpokeAddAsset"),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
        ASSET_ADDRESS: assetAddress,
      },
    }
  );
}

function authorizeUSDTOnAssetReserves(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  const assetAddress = process.env.USDT;
  return execa(
    "forge",
    [
      "script",
      path.resolve("../../contracts/scripts/SpokeAddAsset.s.sol:SpokeAddAsset"),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
        ASSET_ADDRESS: assetAddress,
      },
    }
  );
}

function createUSDCSpokeMToken(chainName, chainMetadata, spokeChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  const assetAddress = process.env.USDC;
  return execa(
    "forge",
    [
      "script",
      path.resolve("../../contracts/scripts/HubAddMToken.s.sol:HubAddMToken"),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
        ASSET_ADDRESS: assetAddress,
        ASSET_CHAIN_ID: spokeChainId,
        NAME: "USDC",
        SYMBOL: "USDC",
      },
    }
  );
}

function createUSDTSpokeMToken(chainName, chainMetadata, spokeChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const hub_mailbox = addresses.mailbox;
  const assetAddress = process.env.USDT;
  return execa(
    "forge",
    [
      "script",
      path.resolve("../../contracts/scripts/HubAddMToken.s.sol:HubAddMToken"),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        SPOKE_CHAIN_ID: spokeChainId,
        ASSET_ADDRESS: assetAddress,
        ASSET_CHAIN_ID: spokeChainId,
        NAME: "USDT",
        SYMBOL: "USDT",
      },
    }
  );
}

function mintUSDCOnSpoke(chainName, chainMetadata, hubChainId) {
  let addresses = loadHyperlaneContractAddresses(chainName);
  const users = getAnvilWallets(10);
  const hub_mailbox = addresses.mailbox;
  const assetAddress = process.env.USDC;
  const mintProcesses = users.map((user) => execa(
    "forge",
    [
      "script",
      path.resolve(
        "../../contracts/scripts/SpokeMintAsset.s.sol:SpokeMintAsset"
      ),
      "--rpc-url",
      chainMetadata.rpcUrls[0].http,
      "--private-key",
      process.env.MEDUSA_KEY,
      "--broadcast",
    ],
    {
      cwd: path.resolve("../../contracts"),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        HUB_MAILBOX: hub_mailbox,
        HUB_CHAIN_ID: hubChainId,
        ASSET_ADDRESS: assetAddress,
        RECIPIENT: user.address,
      },
    }
  ));
  return Promise.all(mintProcesses);
}

function getAnvilWallets(count = 10) {
  const mnemonic = "test test test test test test test test test test test junk";
  const wallets = [];

  for (let i = 0; i < count; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  return wallets;
}