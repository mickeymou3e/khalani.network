
import {  ContractFactory, ethers, Overrides, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../utils/prepare_contracts'
import * as ERC20HDKJSON from '../../../build/contracts/ERC20HDK.json'
import * as GaugeControllerJSON from '../../../build/contracts/GaugeController.json'
import * as PoolProxyJSON from '../../../build/contracts/PoolProxy.json'
import * as MinterJSON from '../../../build/contracts/Minter.json'
import * as LiquidityGaugeJSON from '../../../build/contracts/LiquidityGauge.json'

import {
  ERC20HDK,
  ERC20HDK__factory,
  GaugeController__factory,
  PoolProxy__factory,
  Minter__factory,
  LiquidityGauge__factory,
} from '../../../src/contracts';


export async function deploytDaoToken(
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][DAO Token] Deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(ERC20HDKJSON.abi)),
    ERC20HDKJSON.bytecode,
    deployer
  )  as ERC20HDK__factory;

  const deployTransaction = factory.getDeployTransaction(
    'Hadouken DAO Token',
    'HDK',
    18,
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const doaTokenAddress = receipt.contractAddress
  console.log('[DAO][DAO Token] Deployed', doaTokenAddress)

  return doaTokenAddress
}

export function connectDaoToken(
  daoToken: string,
  deployer: Signer,
) {
    const daoTokenContract = new ethers.Contract(
      daoToken,
      prepare_contract_abi(ERC20HDKJSON.abi),
      deployer.provider
    ).connect(deployer) as ERC20HDK;
  
    return daoTokenContract
}

export async function deployGaugeController(
  daoToken: string,
  votingEscrow: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][GaugeController] Deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(GaugeControllerJSON.abi)),
    GaugeControllerJSON.bytecode,
    deployer,
  )  as GaugeController__factory;

  const deployTransaction = factory.getDeployTransaction(
    daoToken,
    votingEscrow,
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const gaugeControllerAddress = receipt.contractAddress
  
  console.log('[DAO][GaugeController] Deployed', gaugeControllerAddress)
  return gaugeControllerAddress
}

export async function deployPoolProxy(
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][PoolProxy] Deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(PoolProxyJSON.abi)),
    PoolProxyJSON.bytecode,
    deployer,
  )  as PoolProxy__factory;
  
  const deployTransaction = factory.getDeployTransaction(
    admin,
    admin,
    admin,
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const poolProxyAddress = receipt.contractAddress
  
  console.log('[DAO][PoolProxy] Deployed', poolProxyAddress)
  return poolProxyAddress
}

export async function deployMinter(
  daoToken: string,
  gaugeController: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][Minter] Deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(MinterJSON.abi)),
    MinterJSON.bytecode,
    deployer,
  )  as Minter__factory;
  
  const deployTransaction = factory.getDeployTransaction(
    daoToken,
    gaugeController,
    transactionOverrides,
  );
  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const minterAddress = receipt.contractAddress
  
  const daoTokenContract = connectDaoToken(daoToken, deployer)
  daoTokenContract.set_minter(minterAddress)

  console.log('[DAO][Minter] Deployed', minterAddress)
  return minterAddress
}

export async function deployLiquidityGauge(
  lpToken: string,
  minter: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][Liqidity Gauge] deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(LiquidityGaugeJSON.abi)),
    LiquidityGaugeJSON.bytecode,
    deployer,
  )  as LiquidityGauge__factory;

  const deployTransaction = factory.getDeployTransaction(
    lpToken,
    minter,
    transactionOverrides,
  );
  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const liquidityGaugeAddress = receipt.contractAddress
  
  console.log('[DAO][Liqidity Gauge] deployed', liquidityGaugeAddress)

  return liquidityGaugeAddress
}
