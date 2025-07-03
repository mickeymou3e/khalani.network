import { Signer } from 'ethers';
import { Wallet, ContractFactory } from 'zksync-web3';
import ERC20_test_JSON from '../../../../solidity-utils/artifacts-zk/contracts/openzeppelin/ERC20_test.sol/ERC20_test.json';

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
  const abi = ERC20_test_JSON.abi;
  const bytecode = ERC20_test_JSON.bytecode;

  const factory = new ContractFactory(abi, bytecode, signer as Wallet);

  const contract = await factory.deploy(name, symbol, decimals);

  const receipt = await contract.deployTransaction.wait();

  return {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    transactionHash: receipt.transactionHash,
  };
}
