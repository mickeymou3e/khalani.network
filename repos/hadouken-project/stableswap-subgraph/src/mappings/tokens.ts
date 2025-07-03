import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ETH_ZERO_ADDRESS } from '../constants'
import { ERC20, Transfer } from '../../generated/Registry/ERC20'
import { log } from '@graphprotocol/graph-ts'
import * as Schemas from '../../generated/schema'

function createTokenBalance(tokenAddress: Address, account: Address, timestamp: BigInt): Schemas.TokenBalance | null {
  let erc = ERC20.bind(tokenAddress)
  let balance = erc.try_balanceOf(account)

  if (balance.reverted) return null

  let tokenBalanceSchema = new Schemas.TokenBalance(tokenAddress.toHexString() + account.toHexString())
  tokenBalanceSchema.walletAddress = account
  tokenBalanceSchema.tokenAddress = tokenAddress
  tokenBalanceSchema.balance = balance.value
  tokenBalanceSchema.updatedAt = timestamp

  return tokenBalanceSchema
}

export function tokenTransferHandler(event: Transfer): void {
  let sendFrom = event.params.from
  let sendTo = event.params.to
  let value = event.params.value

  let poolAddress = event.address

  log.info('Token Transfer: {}, {}, {}, {}', [poolAddress.toHexString(), sendFrom.toHexString(), sendTo.toHexString(), value.toString()])

  let token = Schemas.PoolToken.load(event.address.toHexString())

  if (token) {
    let tokenBalanceFrom = Schemas.TokenBalance.load(event.address.toHexString() + sendFrom.toHexString())

    if (!tokenBalanceFrom && sendFrom != Address.fromString(ETH_ZERO_ADDRESS)) {
      tokenBalanceFrom = createTokenBalance(event.address, sendFrom, event.block.timestamp)
      if (tokenBalanceFrom) {
        // tokenBalanceFrom.balance = tokenBalanceFrom.balance.minus(event.params.value)
        tokenBalanceFrom.save()
      }
    } else if (tokenBalanceFrom) {
      tokenBalanceFrom.balance = tokenBalanceFrom.balance.minus(event.params.value)
      tokenBalanceFrom.updatedAt = event.block.timestamp
      tokenBalanceFrom.save()
    }

    let tokenBalanceTo = Schemas.TokenBalance.load(event.address.toHexString() + sendTo.toHexString())

    if (!tokenBalanceTo && sendTo != Address.fromString(ETH_ZERO_ADDRESS)) {
      tokenBalanceTo = createTokenBalance(event.address, sendTo, event.block.timestamp)
      if (tokenBalanceTo) {
        // tokenBalanceTo.balance = tokenBalanceTo.balance.plus(event.params.value)
        tokenBalanceTo.save()
      }
    } else if (tokenBalanceTo) {
      tokenBalanceTo.balance = tokenBalanceTo.balance.plus(event.params.value)
      tokenBalanceTo.updatedAt = event.block.timestamp
      tokenBalanceTo.save()
    }
  }
}
