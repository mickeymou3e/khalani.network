import { BigInt } from '@graphprotocol/graph-ts'
import {
  Locked as LockedEvent,
  Unlocked as UnlockedEvent,
  ClaimedHDKTokens as ClaimedHDKTokensEvent,
  DepositedHDK as DepositedHDKEvent,
  DepositedWETH as DepositedWETHEvent,
  FinalizePhaseOne as FinalizePhaseOneEvent,
  LockdropCreated as LockdropCreatedEvent
} from '../types/Lockdrop/HadoukenLockdrop'
import {
  Lockdrop,
  DepositedHDK,
  DepositedWETH,
  LockdropToken
} from '../types/schema'

export function handleLock(event: LockedEvent): void {
  let lock = new Lockdrop(event.params.lockId.toHex())

  lock.timestamp = event.params.time
  lock.tokenAddress = event.params.token
  lock.owner = event.params.owner
  lock.lockId = event.params.lockId
  lock.amount = event.params.amount
  lock.lockLength = event.params.lockLength
  lock.weight = event.params.weight
  lock.isLocked = true
  lock.isClaimed = false
  lock.transaction = event.transaction.hash

  lock.save()
}

export function handleLockdropCreated(event: LockdropCreatedEvent): void {
  const husdToken = new LockdropToken(event.params.husdToken.toHex())
  const triCryptoToken = new LockdropToken(event.params.triCryptoToken.toHex())

  husdToken.price = new BigInt(0)
  triCryptoToken.price = new BigInt(0)

  husdToken.save()
  triCryptoToken.save()
}

export function handleFinalizePhaseOne(event: FinalizePhaseOneEvent): void {
  const husdToken = LockdropToken.load(event.params.husdToken.toHex())
  const triCryptoToken = LockdropToken.load(event.params.triCryptoToken.toHex())

  if (husdToken !== null && triCryptoToken !== null) {
    husdToken.price = event.params.husdPrice
    triCryptoToken.price = event.params.triCryptoPrice

    husdToken.save()
    triCryptoToken.save()
  }
}

export function handleUnlock(event: UnlockedEvent): void {
  const lock = Lockdrop.load(event.params.lockId.toHex())

  if (lock) {
    lock.isLocked = false

    lock.save()
  }
}

export function handleClaimHDKTokens(event: ClaimedHDKTokensEvent): void {
  let lock = Lockdrop.load(event.params.lockId.toHex())
  if (!lock) return
  lock.isClaimed = true

  lock.save()
}

export function handleDepositedHDK(event: DepositedHDKEvent): void {
  const depositedHDKToken = new DepositedHDK(event.transaction.hash.toHex())

  depositedHDKToken.user = event.params.user
  depositedHDKToken.amount = event.params.amount
  depositedHDKToken.timestamp = event.params.time

  depositedHDKToken.save()
}

export function handleDepositedWETH(event: DepositedWETHEvent): void {
  const depositedWETHToken = new DepositedWETH(event.transaction.hash.toHex())

  depositedWETHToken.user = event.params.user
  depositedWETHToken.amount = event.params.amount
  depositedWETHToken.timestamp = event.params.time

  depositedWETHToken.save()
}
