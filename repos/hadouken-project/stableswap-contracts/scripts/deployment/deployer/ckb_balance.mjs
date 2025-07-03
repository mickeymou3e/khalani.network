import { execSync } from 'child_process'
import { mkdirSync, existsSync, readFile, readFileSync } from 'fs'
import fetch from 'node-fetch'

import {
  Address,
  AddressType,
  Amount,
  AmountUnit,
  Builder,
  default as PWCoreDefault,
  IndexerCollector,
  RawProvider,
} from "@lay2/pw-core";
import { RPC } from "ckb-js-toolkit";
import { AddressTranslator } from 'nervos-godwoken-integration';

const PWCore = PWCoreDefault.default;

const ETHEREUM_ADDRESS = "0xABfB1a497fAa51B667Aa2bacA2c768255cb1725c"

const addressTranslator = new AddressTranslator()

const CKB_CLI_PATH = '~/dev/blockchain/nervos/tools/ckb-cli-0.43/ckb-cli'
const PRIVKEY_PATH = './privkey/'

const CKB_URL = 'https://testnet.ckb.dev'
const CKB_INDEXER_URL = 'https://testnet.ckb.dev/indexer'

const FAUCET_SESSION = 'vb%2BJP%2FqpvQpXEsAeyyG%2FSmrItRvuZW%2BjckhP2nzPzvU%2FPdM4vsOY2ZQwVAc7SP%2BTwOxnMCImnU8Hm%2FDXKU5NJzfvK5Xz90d%2FYdU7I8J4rcPag3sKPsw8Wk5n9tlGeme9gtLXPr7C58AVuOW6vn1SQWyy4Gd1LfzWqodFQRvmZXsPG1UOqgBVG2Wf1l4zhoCEIMzi3tVoniqryCHXaRC8E86zhdUyAvMfsvqsnYCimULGPR0fVtfwQSeZ1oJmkwH3qJFypOHIlLrKPdDEkWXJvxSfpCIMspuw5lF2qdspZPtTbIg%3D--c1Qrrqik5OEiW%2FBA--xmQa8kGQEC0S%2Bz1gqyafhA%3D%3D'


async function create_ckb_account() {
  const ckb_cli_output = execSync(`${CKB_CLI_PATH} --url ${CKB_URL} account new`, { encoding: 'utf-8' })

  const output_rows = ckb_cli_output.split('\n')

  const [lock_arg] = output_rows
    .filter(output_row => output_row.includes('lock_arg'))
    .map(lock_arg_row => lock_arg_row.split(':')[1].trim())

  const [testnet_address] = output_rows
    .filter(output_row => output_row.includes('testnet'))
    .map(lock_arg_row => lock_arg_row.split(':')[1].trim())

  return [testnet_address, lock_arg]
}

async function extract_private_key(testnet_address, account_lock_arg) {
  if (!existsSync(PRIVKEY_PATH)) {
    mkdirSync(PRIVKEY_PATH);
  }

  const PRIVKEY_FILE_PATH = PRIVKEY_PATH + testnet_address + '.privkey'

  execSync(`${CKB_CLI_PATH} --url ${CKB_URL} account export --lock-arg ${account_lock_arg} --extended-privkey-path ${PRIVKEY_FILE_PATH}`, { encoding: 'utf-8' })

  const data = readFileSync(PRIVKEY_FILE_PATH, 'utf-8')

  const [account_privkey] = data.split('\n').map(row => row.trim())

  return '0x' + account_privkey
}

async function claim_ckb_faucet(testnet_address) {
  const faucet_request = {
    claim_event: {
      address_hash: testnet_address
    }
  }
  const faucet_response = await fetch("https://faucet.nervos.org/claim_events", {
    "headers": {
      "content-type": "application/json",
      "x-csrf-token": "Na9OdpTHkxa6C1+vRZ0aPXtVfZNjo8vN1Z0k8wTaehazVUwQMWguvLtr5jCGMw4KHZxVlKcPJXmjVNcznxomtg==",
      "cookie": `_ckb_testnet_faucet_session=${FAUCET_SESSION}`,
    },
    "body": JSON.stringify(faucet_request),
    "method": "POST"
  })
  const { data: { attributes: { status } } } = await faucet_response.json()

  await wait_for_ckb(testnet_address, status)
}

async function wait(ms) {
  return new Promise(res => setTimeout(res, ms))
}

async function wait_for_ckb(testnet_address, init_status) {
  let status = init_status
  while (status !== 'processed') {
    const response = await fetch("https://faucet.nervos.org/claim_events", {
      "headers": {
        "cookie": `_ckb_testnet_faucet_session=${FAUCET_SESSION}`
      },
      "body": null,
    })
    const data = await response.json()
    const { claimEvents: { data: claimEvents } } = data
    status = claimEvents
      .filter(({ attributes: { addressHash } }) => addressHash === testnet_address)
      .map(({ attributes: { status: claimEventStatus } }) => claimEventStatus)[0]

    await wait(5000)
  }

  return status
}

async function waitUntilCommitted(txHash, rpc, timeout = 18) {
  for (let index = 0; index < timeout; index++) {
    const data = await rpc.get_transaction(txHash);
    const status = data.tx_status.status;
    console.log(`tx ${txHash} is ${status}, waited for ${index * 10} seconds`);
    await wait(10000);
    if (status === "committed") {
      return;
    }
  }
  throw new Error(`tx ${txHash} not committed in ${timeout * 10} seconds`);
}

async function donor_ckb_to_deployer(deployer_address) {
  const [donor_address_string, account_lock_arg] = await create_ckb_account()

  const account_privkey = await extract_private_key(donor_address_string, account_lock_arg)

  await claim_ckb_faucet(donor_address_string)

  const rpc = new RPC(CKB_URL);
  const provider = new RawProvider(account_privkey);
  await provider.init();

  const indexer_collector = new IndexerCollector(
    CKB_INDEXER_URL,
  )

  const pw_core = await new PWCore(CKB_URL).init(
    provider,
    indexer_collector,
  )

  const donor_address = provider.address
  const donor_balance = await indexer_collector.getBalance(donor_address)

  const AMOUNT_STRING = '9000'
  const donor_amount = new Amount(AMOUNT_STRING, AmountUnit.ckb)

  if (donor_balance.lt(donor_amount)) {
    console.log(`
      You don't have enough SUDT balance.
      Required balance: "${donor_amount.toString()}".
      Your balance: "${donor_balance.toString()}".
      Try sending more SUDT tokens to your Layer 1 address: "${ckb_address.addressString}".    
    `);
    process.exit(1);
  }

  const options = {
    witnessArgs: Builder.WITNESS_ARGS.RawSecp256k1,
    autoCalculateCapacity: true,
    feeRate: 2000,
  }

  const send_ckb_tx = await pw_core.send(
    deployer_address,
    donor_amount,
    options,
  )

  await waitUntilCommitted(send_ckb_tx, rpc);

  const deployer_balance = await indexer_collector.getBalance(deployer_address)
  console.log('Deployer Balance: ', deployer_balance.toString())

  return deployer_balance
}

async function main() {
  // L2 balance
  const deployer_pw_ckb_deposit_l2_address = await addressTranslator.getLayer2DepositAddress(null, ETHEREUM_ADDRESS)

  // L1 balance
  const deployer_ckb_address_string = addressTranslator.ethAddressToCkbAddress(ETHEREUM_ADDRESS, true)
  const deployer_pw_address = new Address(deployer_ckb_address_string, AddressType.ckb)

  const account_num = 100
  for (let i = 0; i < account_num; i++) {
    await donor_ckb_to_deployer(deployer_pw_address)
  }

  console.log('Finished')
}

main()