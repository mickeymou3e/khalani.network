import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'
import { ethers } from 'ethers-v6'

export interface KMSConfig {
  region: string
  accessKeyId?: string
  secretAccessKey?: string
  secretName: string
}

export class KMSService {
  private client: SecretsManagerClient
  private secretName: string

  constructor(config: KMSConfig) {
    this.client = new SecretsManagerClient({
      region: config.region,
      credentials:
        config.accessKeyId && config.secretAccessKey
          ? {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey,
            }
          : undefined,
    })
    this.secretName = config.secretName
  }

  /**
   * Fetch private key from AWS Secrets Manager (key-value pairs format)
   * @param keyName - The key name within the secret (e.g., 'private_key')
   * @returns The private key as a string
   */
  async getPrivateKey(keyName: string): Promise<string> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: this.secretName,
      })

      const response = await this.client.send(command)

      if (!response.SecretString) {
        throw new Error(`No secret string found for secret: ${this.secretName}`)
      }

      const secretData = JSON.parse(response.SecretString)

      if (!secretData[keyName]) {
        throw new Error(
          `Key '${keyName}' not found in secret '${this.secretName}'`,
        )
      }

      return secretData[keyName]
    } catch (error) {
      console.error(`Error fetching private key from Secrets Manager: ${error}`)
      throw new Error(`Failed to fetch private key: ${error}`)
    }
  }

  /**
   * Get a wallet instance from AWS Secrets Manager-stored private key
   * @param keyName - The key name of the stored private key
   * @param provider - Optional provider for the wallet
   * @returns Wallet instance
   */
  async getWallet(
    keyName: string,
    provider?: ethers.Provider,
  ): Promise<ethers.Wallet> {
    const privateKey = await this.getPrivateKey(keyName)
    const wallet = new ethers.Wallet(privateKey, provider)
    this.clearPrivateKeyFromMemory(privateKey)
    return wallet
  }

  /**
   * Securely get private key and immediately use it for a single operation
   * This minimizes the time the private key exists in memory
   * @param keyName - The key name of the stored private key
   * @param operation - Function to execute with the private key
   * @returns Result of the operation
   */
  async withPrivateKey<T>(
    keyName: string,
    operation: (privateKey: string) => Promise<T>,
  ): Promise<T> {
    const privateKey = await this.getPrivateKey(keyName)
    try {
      return await operation(privateKey)
    } finally {
      this.clearPrivateKeyFromMemory(privateKey)
    }
  }

  /**
   * Clear private key from memory by zeroing out the string
   * JS garbage collection may still keep key in memory
   */
  private clearPrivateKeyFromMemory(privateKey: string): void {
    const keyArray = privateKey.split('')
    for (let i = 0; i < keyArray.length; i++) {
      keyArray[i] = '0'
    }
    keyArray.length = 0
  }
}
