import { Signer, ethers } from 'ethers';
import { TestToken__factory } from '@hadouken-project/typechain';

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
  const factory = new ethers.ContractFactory(TestToken__factory.abi, TestToken__factory.bytecode, signer);
  const contract = await factory.deploy(name, symbol, decimals);

  const receipt = await contract.deployTransaction.wait();

  return {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    transactionHash: receipt.transactionHash,
  };
}
