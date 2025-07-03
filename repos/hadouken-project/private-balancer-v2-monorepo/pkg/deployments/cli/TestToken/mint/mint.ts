import { BigNumber, Signer, ethers } from 'ethers';
import { TestToken__factory } from '@hadouken-project/typechain';

export default async function mint(
  tokenAddress: string,
  recipient: string,
  amount: BigNumber,
  signer: Signer
): Promise<BigNumber> {
  const testToken = new ethers.Contract(tokenAddress, TestToken__factory.abi, signer);

  const decimals = await testToken.decimals();

  await testToken.mint(recipient, amount.mul(BigNumber.from(10).pow(decimals)));

  const balance = await testToken.balanceOf(recipient);

  return balance;
}
