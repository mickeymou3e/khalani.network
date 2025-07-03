import { Allowances } from './allowances'
import { Tokens } from './tokens'
import { Wallet } from './wallet'
import { Contracts } from './contracts'
import { MirrorTokens } from './mirrorTokens'
import { KlnTokens } from './klnToken/klnTokens'
import { Safe } from './safe'
import { Chains } from './chains'
import { Prices } from './prices'
import { TransactionHistory } from './transactionHistory'
import { Intents } from './intents'
import { Deposit } from './deposit'

export class Sdk {
  wallet() {
    return new Wallet()
  }

  allowances() {
    return new Allowances()
  }

  tokens() {
    return new Tokens(this)
  }

  mirrorTokens() {
    return new MirrorTokens()
  }

  klnTokens() {
    return new KlnTokens()
  }

  contracts(): Contracts {
    return new Contracts()
  }

  safe() {
    return new Safe()
  }

  chains() {
    return new Chains()
  }

  prices() {
    return new Prices()
  }

  transactionHistory() {
    return new TransactionHistory()
  }

  intents() {
    return new Intents(this)
  }

  deposit() {
    return new Deposit()
  }
}
