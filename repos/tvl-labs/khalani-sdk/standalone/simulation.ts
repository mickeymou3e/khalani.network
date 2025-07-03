import { NetworkType } from './config'
import { runBridgeE2E, runLiquidityE2E } from './e2e'
import { Network } from './types'
import { KMSService } from './services/KMSService'
import { ethers } from 'ethers-v6'

import dotenv from 'dotenv'
dotenv.config()

// KMS Configuration for key management
const kmsConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  secretName: process.env.AWS_SECRET_NAME || 'testnet',
}

const kmsService = new KMSService(kmsConfig)

async function getTestWallet(): Promise<ethers.Wallet> {
  try {
    const wallet = await kmsService.getWallet('e2e_test_key')
    console.log(`Using existing test account: ${wallet.address}`)
    return wallet
  } catch (error) {
    console.error('❌ Error: No test account found in AWS Secrets Manager')
    console.error(
      'Please add a private key with key name "e2e_test_key" to your AWS secret',
    )
    console.error(`Secret name: ${kmsConfig.secretName}`)
    throw new Error('Test wallet not found in AWS Secrets Manager')
  }
}

;(async () => {
  try {
    const wallet = await getTestWallet()
    console.log('wallet', wallet)
    const privateKey = wallet.privateKey

    console.log('🔐 Using KMS-secured private key for E2E testing')
    console.log(`📝 Wallet address: ${wallet.address}`)

    const networkType = NetworkType.testnet

    await runLiquidityE2E(
      Network.ArbitrumSepolia,
      Network.AvalancheTestnet,
      'USDC',
      privateKey,
      networkType,
    )

    await runBridgeE2E(
      Network.AvalancheTestnet,
      Network.ArbitrumSepolia,
      'USDC',
      privateKey,
      networkType,
    )

    console.log('✅ E2E tests completed successfully')
  } catch (error) {
    console.error('❌ Error during E2E testing:', error)
    process.exit(1)
  }
})()
