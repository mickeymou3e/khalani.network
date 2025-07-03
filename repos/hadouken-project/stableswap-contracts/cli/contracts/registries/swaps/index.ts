import { BigNumber } from 'ethers';
import prompts from 'prompts';
import { REGISTRY_CONTRACTS_DIR } from '../../../../scripts/godwoken/registry/constants';
import {
  swap,
  getFactory,
  getBestRate,
  getRegistry,
  runUpdateRegistryAddress
} from '../../../../scripts/godwoken/registry/methods/swaps/updateRegistryAddress';
import { RegistryDeploymentData } from '../../../../scripts/godwoken/registry/types';
import { balanceOf as balanceOfScript } from '../../../../scripts/godwoken/tokens/ERC20/methods/balance'
import { decimals } from '../../../../scripts/godwoken/tokens/ERC20/methods/decimals';
import { symbol } from '../../../../scripts/godwoken/tokens/ERC20/methods/symbol';
import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';
import { transactionOverrides } from '../../../provider';

import { getPools as getPoolsScript } from '../../../../scripts/godwoken/registry/methods/registry/getPools'
import { Cli } from '../../../types';
import { slectPoolsCli } from '../../pools/pool/select';
import { selectTokenCli } from '../../tokens/select';
import { approve as approveScript } from '../../../../scripts/godwoken/tokens/ERC20/methods/approve';
import { allowance as allowanceScript } from '../../../../scripts/godwoken/tokens/ERC20/methods/allowance';

const swapsCli: Cli = async ({ environment, parentCli }) => {
  const registryDeploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, environment.network)
  const registryDeploymentData = getData<RegistryDeploymentData>(registryDeploymentDataPath)

  const swapsAddress = registryDeploymentData?.Swaps
  if (swapsAddress) {

    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'swap', value: 'swap'},
          { title: 'get factory ', value: 'get-factory' },
          { title: 'get registry', value: 'get-registry'},
          { title: 'get best rate', value: 'get-best-rate'},
          { title: 'update registry address', value: 'update-registry-address'},
        ],
    }, {
      onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0)
      }
    })

    switch(action) {
      case 'swap': {
        const fromTokenAddress = await selectTokenCli({ message: 'Select exchange from token', ...{ environment } })
        const fromTokenDecimals = await decimals(fromTokenAddress, environment.wallet, transactionOverrides)
        const fromTokenSymbol = await symbol(fromTokenAddress, environment.wallet, transactionOverrides)

        const toTokenAddress = await selectTokenCli({ message: 'Select exchange to token', ...{ environment } })
        const toTokenDecimals = await decimals(toTokenAddress, environment.wallet, transactionOverrides)
        const toTokenSymbol = await symbol(toTokenAddress, environment.wallet, transactionOverrides)


        const userBalanceFromToken = await balanceOfScript(environment.address, fromTokenAddress, environment.wallet, environment.transactionOverrides)
        console.log(`User balance of ${fromTokenSymbol}`, userBalanceFromToken.div(BigNumber.from(10).pow(BigNumber.from(fromTokenDecimals))).toString())

        const { amount } = await prompts({
          type: 'number',
          name: 'amount',
          message: `How much ${fromTokenSymbol} to swap?`,
          validate: amount => BigNumber.from(amount).mul(BigNumber.from(10).pow(BigNumber.from(fromTokenDecimals))).gt(userBalanceFromToken) ? `Not enough balance` : true
        })
        const exchangeAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(BigNumber.from(fromTokenDecimals)))
        await approveScript(exchangeAmount, fromTokenAddress, swapsAddress, environment.wallet, environment.transactionOverrides)
        const allowance = await allowanceScript(environment.address, fromTokenAddress, swapsAddress, environment.wallet, environment.transactionOverrides)

        console.log(`Allowance ${fromTokenSymbol}`, allowance.toString())

        const bestRateCallResult = await getBestRate(fromTokenAddress, toTokenAddress, exchangeAmount, {
          admin: environment.address,
          provider: environment.provider,
          deployer: environment.wallet,
          network: environment.network
        })

        if (bestRateCallResult) {
          const [poolAddress, _] = bestRateCallResult

          const expectedAmount = BigNumber.from(0)
          console.log('Swap through pool', poolAddress)
          let poolBalanceFromToken = await balanceOfScript(poolAddress, fromTokenAddress, environment.wallet, environment.transactionOverrides)
          let poolBalanceToToken = await balanceOfScript(poolAddress, toTokenAddress, environment.wallet, environment.transactionOverrides)

          console.log(`Pool balance of ${fromTokenSymbol}`, poolBalanceFromToken.div(BigNumber.from(10).pow(BigNumber.from(fromTokenDecimals))).toString())
          console.log(`Pool balance of ${toTokenSymbol}`, poolBalanceToToken.div(BigNumber.from(10).pow(BigNumber.from(toTokenDecimals))).toString())

          await swap(poolAddress, fromTokenAddress, toTokenAddress, exchangeAmount, expectedAmount, {
            admin: environment.address,
            provider: environment.provider,
            deployer: environment.wallet,
            network: environment.network
          })

          poolBalanceFromToken = await balanceOfScript(poolAddress, fromTokenAddress, environment.wallet, environment.transactionOverrides)
          poolBalanceToToken = await balanceOfScript(poolAddress, toTokenAddress, environment.wallet, environment.transactionOverrides)

          console.log(`New pool balance of ${fromTokenSymbol}`, poolBalanceFromToken.div(BigNumber.from(10).pow(BigNumber.from(fromTokenDecimals))).toString())
          console.log(`New pool balance of ${toTokenSymbol}`, poolBalanceToToken.div(BigNumber.from(10).pow(BigNumber.from(toTokenDecimals))).toString())
          
        }

        break
      }
      case 'get-factory': {
        await getFactory({
          admin: environment.address,
          provider: environment.provider,
          deployer: environment.wallet,
          network: environment.network
        })
        break
      }
      case 'get-registry': {
        await getRegistry({
          admin: environment.address,
          provider: environment.provider,
          deployer: environment.wallet,
          network: environment.network
        })
        break
      }
      case 'update-registry-address': {
        await runUpdateRegistryAddress({
          network: environment.network,
          admin: environment.address,
          deployer: environment.wallet,
          provider: environment.provider,
        })
        break
      }
      case 'get-best-rate': {
        const fromTokenAddress = await selectTokenCli({ message: 'Select exchange from token', ...{ environment } })
        const tokenDecimals = await decimals(fromTokenAddress, environment.wallet, transactionOverrides)

        const toTokenAddress = await selectTokenCli({ message: 'Select exchange to token', ...{ environment } })

        const exhcangeAmount = BigNumber.from(10).pow(BigNumber.from(tokenDecimals))
        
        const bestRateCallResult = await getBestRate(fromTokenAddress, toTokenAddress, exhcangeAmount, {
          admin: environment.address,
          provider: environment.provider,
          deployer: environment.wallet,
          network: environment.network
        })

        if (bestRateCallResult) {
          const [poolName, exchangeAmount] = bestRateCallResult
          console.log('[Swaps] get best rate', poolName)
          console.log('[Swaps] get best rate amount', exchangeAmount.toString())
        }
        break
      }
      default:
          break
    }
  }

  return swapsCli({ environment, parentCli })
}

export default swapsCli
