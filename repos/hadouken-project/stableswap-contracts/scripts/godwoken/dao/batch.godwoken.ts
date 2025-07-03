
import { Overrides, Signer } from 'ethers';

import Config from '../../../config.json'

import { deployAll as deployVotingEscrowAll } from './VotingEscrow/batch.godwoken' 

import { DaoDeploymentData } from './types'

import { overrideData, getDeploymentDataPath, wait } from '../utils';

import { DAO_CONTRACTS_DIR } from './constants'
import { deployGaugeController, deployMinter, deployPoolProxy, deploytDaoToken } from './deploy.godwoken';

export async function  deployAll(
  network: string,
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  try {
    const daoToken = await deploytDaoToken(deployer, transactionOverrides)
    await wait(Config.timeout)
    
    const votingEscrow = await deployVotingEscrowAll(network, daoToken, admin, deployer, transactionOverrides)
    await wait(Config.timeout)

    const gaugeController = await deployGaugeController(daoToken, votingEscrow, deployer, transactionOverrides)
    await wait(Config.timeout)

    const poolProxy = await deployPoolProxy(admin, deployer, transactionOverrides)
    await wait(Config.timeout)

    const minter = await deployMinter(daoToken, gaugeController, deployer, transactionOverrides)
    await wait(Config.timeout)
    
    const deploymentDataPath = getDeploymentDataPath(DAO_CONTRACTS_DIR, network)
    overrideData<DaoDeploymentData>(deploymentDataPath, {
      ERC20HDK: daoToken,
      VotingEscrow: votingEscrow,
      GaugeController: gaugeController,
      PoolProxy: poolProxy,
      Minter: minter,
    })

    return {
      daoToken,
      votingEscrow,
      gaugeController,
      poolProxy,
      minter,
    }
  } catch(error) {
    console.error(error)
  }
}
