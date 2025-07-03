import { ContractService } from './ContractService'
import { TokensService } from './TokensService'

export class BalanceService {
  private contractService: ContractService | null = null
  private tokensService: TokensService | null = null
  /**
   * Constructor with optional contractService parameter.
   */
  constructor(
    contractService?: ContractService,
    tokensService?: TokensService,
  ) {
    if (contractService) {
      this.contractService = contractService
    }
    if (tokensService) {
      this.tokensService = tokensService
    }
  }

  public async getMTokenBalance(
    mTokenAddress: string,
    userAddress: string,
  ): Promise<bigint> {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const mTokenContract = this.contractService.getMTokenContract(mTokenAddress)
    const balance = await mTokenContract.balanceOf(userAddress)
    return balance
  }

  public async getERC20Balance(
    tokenAddress: string,
    userAddress: string,
  ): Promise<bigint> {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const erc20Contract = this.contractService.getERC20Contract(tokenAddress)
    const balance = await erc20Contract.balanceOf(userAddress)
    return balance
  }

  /**
   * Wait for the mToken balance to reach the expected amount.
   *
   * @param spokeToken - An object with token details: symbol and chainId.
   * @param expectedBalance - The balance you expect as a positive bigint.
   * @param account - The user account to check the balance on.
   * @param timeout - How long to wait (milliseconds) before throwing an error (default 60000).
   * @param interval - Polling interval in milliseconds (default 2000).
   * @returns True when the balance reaches or exceeds expectedBalance.
   * @throws Error if the timeout is reached or required input is missing.
   */
  public async waitForMinting(
    spokeToken: { address: string; chainId: string },
    expectedBalance: bigint,
    account: string,
    timeout = 60000,
    interval = 2000,
  ): Promise<boolean> {
    if (!this.tokensService) {
      throw new Error('TokensService is not initialized')
    }
    if (!account) throw new Error('Account address is required')
    if (!expectedBalance || expectedBalance <= 0n)
      throw new Error('Expected balance must be a positive value')
    if (interval < 100) throw new Error('Interval must be at least 100ms')

    const startTime = Date.now()

    const mTokenAddress = this.tokensService.findArcadiaToken(
      Number(spokeToken.chainId),
      spokeToken.address,
    ).address

    while (Date.now() - startTime < timeout) {
      const currentBalance = await this.getMTokenBalance(mTokenAddress, account)
      if (currentBalance >= expectedBalance) {
        return true
      }
      await new Promise((resolve) => setTimeout(resolve, interval))
    }

    throw new Error('Timeout: Logic did not succeed within the specified time.')
  }
}
