import { BigNumber, Signer } from 'ethers';
import { ethers } from 'hardhat';
import TestTokenJSON from '../../../../solidity-utils/artifacts-zk/contracts/openzeppelin/ERC20_test.sol/ERC20_test.json';

export default async function mint(
  tokenAddress: string,
  recipient: string,
  amount: BigNumber,
  signer: Signer
): Promise<BigNumber> {
  const testToken = new ethers.Contract(tokenAddress, TestTokenJSON.abi, signer);

  const decimals = await testToken.decimals();

  await testToken.mint(recipient, amount.mul(BigNumber.from(10).pow(decimals)));

  const balance = await testToken.balanceOf(recipient);

  return balance;
}
