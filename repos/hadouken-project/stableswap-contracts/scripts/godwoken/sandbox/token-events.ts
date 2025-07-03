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

export async function deployerBalance() {
  const network = ['godwoken', config.env].filter(arg => arg).join('.')
  console.log('deploy network', network)
  const { deployer, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, config)

  console.log('deployer', deployer)
  const polyjuiceAdminAddress = translateAddress(deployer.address)

  console.log('ethereum address', deployer.address)
  console.log('godwoken address', polyjuiceAdminAddress)

  const tokens = getTokensData(network)

  for (let times = 1; times > 0; times--) {
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {

      const tokenName = tokens[tokenIndex].name

      const balanceAcc = {}
      if (['WCKB', 'DCKB'].includes(tokenName.toUpperCase())) {
        console.log(tokenName)
        const tokenAddress = tokens[tokenIndex].underlying_address as string
        console.log(tokenAddress)

        const tokenContract = connectToken(tokenAddress, deployer)

        const filter = tokenContract.filters.Transfer(null, null, null)

        const events = await tokenContract.queryFilter(filter)
        events.forEach(event => {
            console.log('Event')
            const [from, to, value] = event.args
            // const balanceTo = balanceAcc[from] ?? 0
            // balanceAcc[to] = balanceTo + value.toNumber()
            console.log(from, to)
            console.log(value.toString())
        })
        // const transaction = await tokenContract.claimTestToken(
        //   polyjuiceAdminAddress,
        //   transactionOverrides,
        // )
        // console.log(`[${tokenName}]`, '[claim test token]', 'tx hash', transaction.hash)

        // await transaction.wait()

        const balance = await tokenContract.balanceOf(polyjuiceAdminAddress)
        console.log('balance', balance.toString())
      }
    }

  }
}

deployerBalance()