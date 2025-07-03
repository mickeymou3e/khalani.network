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
import { connectWCKBToken } from '../connect'
import { getTokensData } from '../token.utils'
import { BigNumber } from '@ethersproject/bignumber';
import { PolyjuiceWallet } from '@polyjuice-provider/ethers';
import { Overrides } from '@ethersproject/contracts';

const WCKB_NAME = 'wCKB'

export function connectWCKB(network: string, deployer: PolyjuiceWallet) {
    const tokens = getTokensData(network)

    const [wCKBToken] = tokens.filter(({ name }) => name === WCKB_NAME)


    const wCKBTokenAddress = wCKBToken.underlying_address
    const wCKBtokenContract = connectWCKBToken(wCKBTokenAddress, deployer)

    return wCKBtokenContract
}

export async function deployerWCKBBalance(network: string, admin: string, deployer: PolyjuiceWallet, transactionOverrides: Overrides) {
    const wCKBtokenContract = connectWCKB(network, deployer)

    const balance = await wCKBtokenContract.balanceOf(
        admin,
        transactionOverrides
    )
    console.log(`Balance ${WCKB_NAME}`, balance.toString())

    return balance
}

export async function deployerCKBBalance(deployer: PolyjuiceWallet) {
    const balance = await deployer.getBalance()
    console.log(`Balance CKB`, balance.toString())

    return balance
}

const expectedBalance = BigNumber.from(10).pow(6).mul(BigNumber.from(10).pow(8))

export async function depositWCKB(network: string, deployer: PolyjuiceWallet, transactionOverrides: Overrides) {
    const wCKBtokenContract = connectWCKB(network, deployer)

    const depositTx = await wCKBtokenContract.deposit({ ...transactionOverrides, value: expectedBalance })
    await depositTx.wait()
}

async function main() {
    const network = ['godwoken', config.env].filter(arg => arg).join('.')
    console.log('deploy network', network)

    const { deployer, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, config)

    const polyjuiceAdminAddress = translateAddress(deployer.address)

    console.log('ethereum address', deployer.address)
    console.log('godwoken address', polyjuiceAdminAddress)

    const ckbBalance = await deployerCKBBalance(deployer)
    await deployerWCKBBalance(network, polyjuiceAdminAddress, deployer, transactionOverrides)

    console.log(`Expected balance wCKB`, expectedBalance.toString())
    if (ckbBalance.gt(expectedBalance)) {
        await depositWCKB(network, deployer, transactionOverrides)

        await deployerWCKBBalance(network, polyjuiceAdminAddress, deployer, transactionOverrides)
    }
}

main()
