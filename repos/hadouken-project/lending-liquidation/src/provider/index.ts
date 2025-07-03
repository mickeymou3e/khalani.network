import { providers, Wallet } from 'ethers'
import Config from '../config.json'

export const getDeployer = async (): Promise<Wallet> => {
  const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY

  if (!DEPLOYER_PRIVATE_KEY) throw Error('No private key provided in env')

  const provider = new providers.JsonRpcProvider(
    Config.nervos.godwoken.rpcUrl,
    Number(Config.chainId),
  )

  const signer = new Wallet(DEPLOYER_PRIVATE_KEY, provider)

  return signer
}
