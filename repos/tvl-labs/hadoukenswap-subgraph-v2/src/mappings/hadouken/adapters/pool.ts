import { Address } from '@graphprotocol/graph-ts';
import { ZERO } from '../../constants';
import { Pool, PoolToken, PoolTokenBalance } from '../../../types/schema';
import { getPoolTokenId } from '../../balancer/helpers/misc';

export function postNewPoolCreated(poolId: string): void {
  let pool = Pool.load(poolId)

  if (pool) {
    let tokensAddresses = pool.tokens
    if (tokensAddresses) {
      for (let i = 0; i < tokensAddresses.length; ++i) {
        let tokenAddress = tokensAddresses[i]
        let poolTokenId = getPoolTokenId(poolId, Address.fromString(tokenAddress))
        let poolTokenBalance = new PoolTokenBalance(poolTokenId)
  
        poolTokenBalance.balance = ZERO
        
        let token = PoolToken.load(poolTokenId)
        if (token !== null) {
          poolTokenBalance.decimals = token.decimals || 0
          poolTokenBalance.save()
        }
      }
    }
  }
}