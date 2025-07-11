import { SpotPriceConcern } from '../types';
import { SubgraphPoolBase, LinearPool, ZERO } from '@hadouken-project/sor';
import { Pool } from '@/types';

export class LinearPoolSpotPrice implements SpotPriceConcern {
  calcPoolSpotPrice(tokenIn: string, tokenOut: string, pool: Pool): string {
    const linearPool = LinearPool.fromPool(pool as SubgraphPoolBase);
    const poolPairData = linearPool.parsePoolPairData(tokenIn, tokenOut);
    return linearPool
      ._spotPriceAfterSwapExactTokenInForTokenOut(poolPairData, ZERO)
      .toString();
  }
}
