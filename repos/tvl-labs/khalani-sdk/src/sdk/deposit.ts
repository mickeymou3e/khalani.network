import {
  DepositData,
  DepositRecord,
  getDepositById,
  listDeposits,
  monitorMinting,
} from '@services/deposit'

export class Deposit {
  constructor() {}

  /**
   * Fire-and-forget initiation of mint + intent.
   * @param data The deposit data
   * @returns Promise with the deposit ID
   */
  async monitorMinting(data: DepositData): Promise<{ depositId: string }> {
    return monitorMinting(data)
  }

  /**
   * List a user's deposits, optionally filtered by status.
   * @param userAddress The address of the user
   * @param status Optional status filter
   * @returns Promise with an array of deposit records
   */
  async listDeposits(
    userAddress: string,
    status?: 'pending' | 'error' | 'success',
  ): Promise<DepositRecord[]> {
    return listDeposits(userAddress, status)
  }

  /**
   * Fetch a single deposit by its ID.
   * @param id The deposit ID
   * @returns Promise with the deposit record
   */
  async getDepositById(id: string): Promise<DepositRecord> {
    return getDepositById(id)
  }
}
