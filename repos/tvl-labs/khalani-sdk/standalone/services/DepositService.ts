import { SignatureTransfer, PermitTransferFrom } from '@uniswap/permit2-sdk'
import { ContractService } from './ContractService'

import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
  ethers,
} from 'ethers-v6'
import { BigNumber, PopulatedTransaction, utils } from 'ethers'
import { WalletService } from './WalletService'
import { Network } from '../types'

export class DepositService {
  private contractService: ContractService | null = null
  private walletService: WalletService | null = null

  /**
   * Constructor with optional dependencies.
   */
  constructor(
    contractService?: ContractService,
    walletService?: WalletService,
  ) {
    if (contractService) {
      this.contractService = contractService
    }
    if (walletService) {
      this.walletService = walletService
    }
  }

  /**
   * Check traditional ERC20 allowance for the asset reserves contract.
   */
  public checkERC20Approval = async (
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
  ): Promise<bigint> => {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const assetReservesAddress =
      this.contractService.getAssetReservesAddress(chainId)
    if (!assetReservesAddress) {
      throw new Error(`AssetReserves address not found for chain ${chainId}`)
    }
    const tokenContract = this.contractService.getERC20Contract(tokenAddress)
    try {
      const allowance: bigint = await tokenContract.allowance(
        walletAddress,
        assetReservesAddress,
      )
      console.log('allowance', allowance)
      return allowance
    } catch (error) {
      console.error('Error checking ERC20 approval:', error)
      throw error
    }
  }

  /**
   * Approve the asset reserves contract to spend an ERC20 token.
   */
  public approveERC20 = async (
    chainId: number,
    tokenAddress: string,
    requiredAmount: bigint,
  ): Promise<ContractTransactionReceipt | null> => {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const assetReservesAddress =
      this.contractService.getAssetReservesAddress(chainId)
    if (!assetReservesAddress) {
      throw new Error(`AssetReserves address not found for chain ${chainId}`)
    }
    try {
      const tokenContract = this.contractService.getERC20Contract(tokenAddress)
      const tx: ContractTransactionResponse = await tokenContract.approve(
        assetReservesAddress,
        requiredAmount,
      )
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error approving ERC20 token:', error)
      throw error
    }
  }

  /**
   * Ensure the AssetReserves contract has sufficient allowance, approve if needed.
   */
  public ensureERC20Allowance = async (
    chainId: number,
    tokenAddress: string,
    requiredAmount: bigint,
  ): Promise<ContractTransactionReceipt | null> => {
    if (!this.walletService || !this.walletService.signer) {
      throw new Error('WalletService or signer not initialized')
    }
    const walletAddress = await this.walletService.signer.getAddress()
    const allowance = await this.checkERC20Approval(
      chainId,
      tokenAddress,
      walletAddress,
    )
    if (allowance < requiredAmount) {
      console.log(
        `Current allowance (${allowance.toString()}) is less than required (${requiredAmount.toString()}), approving...`,
      )
      const receipt = await this.approveERC20(
        chainId,
        tokenAddress,
        requiredAmount,
      )
      return receipt
    }
    console.log('Sufficient ERC20 allowance exists:', allowance.toString())
    return null
  }

  public checkTokenPermit2Approval = async (
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
  ) => {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const permit2Address = this.contractService.getPermit2Address(chainId)
    const tokenContract = this.contractService.getERC20Contract(tokenAddress)

    try {
      const allowance = await tokenContract.allowance(
        walletAddress,
        permit2Address,
      )
      return allowance
    } catch (error) {
      console.error('Error checking token approval for Permit2:', error)
      throw error
    }
  }

  public approveTokenForPermit2 = async (
    chainId: number,
    tokenAddress: string,
  ) => {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const permit2Address = this.contractService.getPermit2Address(chainId)
    if (!permit2Address) {
      throw new Error(`Permit2 address not found for chain ${chainId}`)
    }

    try {
      const tokenContract = this.contractService.getERC20Contract(tokenAddress)
      const tx = await tokenContract.approve(permit2Address, ethers.MaxUint256)
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error approving token for Permit2:', error)
      throw error
    }
  }

  public signPermit2Message = async (
    chainId: number,
    tokenAddress: string,
    amount: bigint,
    intentNonce: bigint,
    intentDeadline: bigint,
  ): Promise<string> => {
    if (!this.walletService || !this.walletService.signer) {
      throw new Error('Signer not initialized in walletService')
    }

    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }

    const permit2Address = this.contractService.getPermit2Address(chainId)
    if (!permit2Address) {
      throw new Error(`Permit2 address not found for chain ${chainId}`)
    }

    const assetReservesAddress =
      this.contractService.getAssetReservesAddress(chainId)
    const traditionalChainId = Number(chainId)

    const permit: PermitTransferFrom = {
      permitted: {
        token: tokenAddress,
        amount,
      },
      spender: assetReservesAddress,
      nonce: intentNonce,
      deadline: intentDeadline,
    }

    const { domain, types, values } = SignatureTransfer.getPermitData(
      permit,
      permit2Address,
      traditionalChainId,
    )

    if (!domain || !types || !values) {
      throw new Error('Invalid Permit2 message')
    }

    try {
      const signature = await this.walletService.signer.signTypedData(
        domain as any,
        types,
        values,
      )
      return signature
    } catch (error) {
      console.error('Error signing Permit2 message:', error)
      throw error
    }
  }

  public permit2Allowance = async (
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
  ) => {
    const permit2Allowance = await this.checkTokenPermit2Approval(
      chainId,
      tokenAddress,
      walletAddress,
    )

    if (permit2Allowance === BigInt(0)) {
      const approveHash = await this.approveTokenForPermit2(
        chainId,
        tokenAddress,
      )
      console.log('Approval transaction hash:', approveHash)
      return approveHash
    } else {
      console.log('Token is already approved for Permit2')
      return null
    }
  }

  /** Deposit traditional (signed on-chain approval) */
  public async depositTraditional(
    tokenAddress: string,
    amount: bigint,
  ): Promise<ContractTransactionReceipt> {
    if (!this.contractService)
      throw new Error('ContractService not initialized')
    const assetReservesContract =
      this.contractService.getAssetReservesContract(true)
    const hubChain = this.walletService?.getHubChain()
    const tx: ContractTransactionResponse = await assetReservesContract.deposit(
      tokenAddress,
      amount,
      Number(hubChain),
      { value: ethers.parseEther('0.1') },
    )
    const receipt = await tx.wait()
    if (!receipt) throw new Error('Deposit transaction failed')
    if (receipt.status === 0) {
      console.error('Transaction reverted:', receipt)
      throw new Error('Deposit transaction reverted')
    }
    return receipt
  }

  /** Deposit via Permit2 (signed off-chain approval) */
  public async depositWithPermit2(
    tokenAddress: string,
    amount: bigint,
    nonce: bigint,
    deadline: bigint,
    account: string,
    signature: `0x${string}`,
  ): Promise<ContractTransactionReceipt> {
    if (!this.contractService)
      throw new Error('ContractService not initialized')

    const assetReservesContract =
      this.contractService.getAssetReservesContract()
    const hubChain = this.walletService?.getHubChain()
    const tx = await assetReservesContract.deposit(
      tokenAddress,
      amount,
      Number(hubChain),
      nonce,
      deadline,
      account,
      signature,
      { value: ethers.parseEther('0.1') },
    )
    const receipt = await tx.wait()
    if (!receipt) throw new Error('Deposit with Permit2 failed')
    if (receipt.status === 0) {
      console.error('Transaction reverted:', receipt)
      throw new Error('Deposit transaction reverted')
    }
    return receipt
  }

  /** Build a raw tx for traditional deposit */
  public populateTraditionalTx(
    fromChainId: number,
    toChainId: number,
    tokenAddress: string,
    tokenAmount: bigint,
  ): PopulatedTransaction {
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const iface = new utils.Interface([
      'function deposit(address token, uint256 amount, uint32 destChain)',
    ])
    const data = iface.encodeFunctionData('deposit', [
      tokenAddress,
      tokenAmount,
      toChainId,
    ])
    return {
      to: this.contractService.getAssetReservesAddress(fromChainId),
      value: BigNumber.from('0'),
      data,
      chainId: fromChainId,
      gasLimit: BigNumber.from('200000'),
      gasPrice: BigNumber.from('20000000000'),
    }
  }

  /** Build a raw tx for Permit2 deposit */
  public populatePermit2Tx(args: {
    fromChainId: number
    toChainId: number
    tokenAddress: string
    tokenAmount: bigint
    permitNonce: bigint
    deadline: bigint
    account: string
    signature: `0x${string}`
  }): PopulatedTransaction {
    const {
      fromChainId,
      toChainId,
      tokenAddress,
      tokenAmount,
      permitNonce,
      deadline,
      account,
      signature,
    } = args
    if (!this.contractService) {
      throw new Error('ContractService is not initialized')
    }
    const iface = new utils.Interface([
      'function deposit(address token,uint256 amount,uint32 destChain,uint256 permitNonce,uint256 deadline,address recipient,bytes signature)',
    ])
    const data = iface.encodeFunctionData('deposit', [
      tokenAddress,
      tokenAmount,
      toChainId,
      permitNonce,
      deadline,
      account,
      signature,
    ])
    return {
      to: this.contractService.getAssetReservesAddress(fromChainId),
      value: BigNumber.from('0'),
      data,
      nonce: Math.floor(Date.now() / 1000) + 600,
      chainId: fromChainId,
      gasLimit: BigNumber.from('200000'),
      gasPrice: BigNumber.from('20000000000'),
    }
  }

  public getValueInWei = () => BigNumber.from('10000000')
}
