require('dotenv').config()

const DEPLOYMENT_NETWORK = process.env.DEPLOYMENT_NETWORK;
const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV;

console.log('.env')
console.log('DEPLOYMENT_NETWORK', DEPLOYMENT_NETWORK)
console.log('DEPLOYMENT_ENV', DEPLOYMENT_ENV)
console.log('')

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error('Set env variable DEPLOYER_PRIVATE_KEY or add to .env config file')
}

if (!DEPLOYMENT_NETWORK) {
  throw new Error('Deployment network not provided . Set viw "export DEPLOYMENT_NETWORK" or .env config file')
}
import config from '../../../config.json'
import { transactionOverrides, connectRPC } from '../deployment.godwoken'
import { connectToken } from '../connect'
import { getTokensData } from '../token.utils'
import { getTokensDeploymentDataAll } from '../tokens/batch.godwoken';

export async function deployerBalance() {
  const network = ['godwoken', config.env].filter(arg => arg).join('.')
  console.log('deploy network', network)
  const { deployer, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, config)

  const polyjuiceAdminAddress = translateAddress(deployer.address)

  console.log('ethereum address', deployer.address)
  console.log('godwoken address', polyjuiceAdminAddress)

  const tokens = getTokensDeploymentDataAll(network)

  for (let times = 1; times > 0; times--) {
    for (let tokenIndex = 0; tokenIndex < Object.keys(tokens).length; tokenIndex++) {
      const tokenAddress = Object.values(tokens)[tokenIndex]

      const tokenContract = connectToken(tokenAddress, deployer)

      const balance = await tokenContract.balanceOf(polyjuiceAdminAddress)
      const symbol = await tokenContract.symbol()
      console.log('balance', symbol, balance.toString())
    }

  }
}

deployerBalance()