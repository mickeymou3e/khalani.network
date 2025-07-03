import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import TestTokenJSON from '../abi/TestToken.json';

export default async function deploy(
  name: string,
  symbol: string,
  decimals: number,
  signer: Signer
): Promise<{
  address: string;
  blockNumber: number;
  transactionHash: string;
}> {
  const factory = new ethers.ContractFactory(TestTokenJSON.abi, TestTokenJSON.bytecode, signer);
  const contract = await factory.deploy(name, symbol, decimals);

  const receipt = await contract.deployTransaction.wait();

  return {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    transactionHash: receipt.transactionHash,
  };
}
