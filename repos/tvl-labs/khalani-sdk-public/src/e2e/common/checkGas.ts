import { Network } from '@constants/Networks'
import {
  getDispatchedMailboxMessage,
  getProcessedMailboxMessage,
} from '@graph/mailbox'
import { ethers, JsonRpcProvider } from 'ethers-v6'

type GasPaymentEvent = {
  gasAmount: string
  payment: string
}

const decodeGasPaymentEvent = async (
  provider: JsonRpcProvider,
  txHash: string,
): Promise<GasPaymentEvent> => {
  try {
    const txReceipt = await provider.getTransactionReceipt(txHash)
    if (!txReceipt) throw new Error('Transaction receipt is null')

    const signature = 'f715e66d2'
    const filteredLogs = txReceipt.logs.filter((log) => {
      return log.topics.some((topic) => topic.includes(signature))
    })
    const abi = new ethers.AbiCoder()
    const decodedData = abi.decode(['uint256', 'uint256'], filteredLogs[0].data)

    const gasAmount: string = decodedData[0]
    const payment: string = decodedData[1]

    return { gasAmount, payment }
  } catch (error) {
    console.error(error)
    throw new Error('Error decoding gas payment event')
  }
}

export const checkGas = async (
  txHash: string,
  sourceNetwork: Network,
  provider: JsonRpcProvider,
): Promise<void> => {
  try {
    const { gasAmount, payment }: GasPaymentEvent = await decodeGasPaymentEvent(
      provider,
      txHash,
    )

    console.log(
      `Source transaction gas amount: ${gasAmount}, gas payment: ${payment}`,
    )

    // TODO: Remove after redeploying subgraphs
    return
    const sourceChainMailboxMessage = await getDispatchedMailboxMessage(
      txHash,
      sourceNetwork,
    )

    if (!sourceChainMailboxMessage) {
      throw new Error(`Can't find source chain dispatched mailbox message.`)
    }

    const message = await getProcessedMailboxMessage(
      sourceChainMailboxMessage.id,
      Network.Khalani,
    )

    const khalaniProvider = new JsonRpcProvider(
      'https://testnet.khalani.network/',
    )

    if (message) {
      const { gasAmount: khalaniGasAmount, payment: khalaniPayment } =
        await decodeGasPaymentEvent(khalaniProvider, message.transactionHash)

      console.log(
        `Khalani transaction gas amount: ${khalaniGasAmount}, gas payment: ${khalaniPayment}`,
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error checking gas')
  }
}
