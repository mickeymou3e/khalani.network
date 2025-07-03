import * as dotenv from "dotenv"
import { HardhatUserConfig, task } from "hardhat/config"
import { upgradeTreasury } from "./scripts/upgrade"
import { addOperator } from "./scripts/addOperator"
import { removeOperator } from "./scripts/removeOperator"
import { sendTokens } from "./scripts/sendTokens"
import "@nomicfoundation/hardhat-toolbox"
import "./type-extensions"
import "hardhat-deploy"
import "@openzeppelin/hardhat-upgrades"
import "@rumblefishdev/hardhat-kms-signer"

dotenv.config()

task("upgrade-treasury", "Upgrade Treasury contract")
  .addParam("contract", "name of the contract set as a new treasury implementation")
  .setAction(async ({ contract }, hre) => {
    await upgradeTreasury(contract, hre)
  })

task("add-operator", "Grant operator role to user")
  .addParam("operatorAddress", "address of new operator")
  .setAction(async ({ operatorAddress }, hre) => {
    await addOperator(operatorAddress, hre)
  })

task("remove-operator", "Invoke operator role from user")
  .addParam("operatorAddress", "address of operator to be removed")
  .setAction(async ({ operatorAddress }, hre) => {
    await removeOperator(operatorAddress, hre)
  })

task("send-tokens", "Send tokens from treasury to address")
  .addParam("tokenAddress", "address of token")
  .addParam("amount", "amount of token")
  .addParam("recipient", "address of recipient")
  .addParam("decimals", "token decimals")
  .setAction(async ({ tokenAddress, amount, decimals, recipient }, hre) => {
    await sendTokens(tokenAddress, amount, decimals, recipient, hre)
  })

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "godwokenTestnet",
  networks: {
    godwoken: {
      live: true,
      url: "https://v1.mainnet.godwoken.io/rpc",
      chainId: 71402,
      vaultAddress: "0x4F8BDF24826EbcF649658147756115Ee867b7D63",
      kmsKeyId: process.env.KMS_KEY_ID,
      tags: ["mainnet"],
    },
    godwokenTestnet: {
      live: true,
      url: "https://godwoken-testnet-v1.ckbapp.dev",
      chainId: 71401,
      vaultAddress: "0xd69FAC6C632eF023afCe7471Bda724b228237570",
      kmsKeyId: process.env.KMS_KEY_ID,
      tags: ["testnet"],
    },
  },
}

export default config
