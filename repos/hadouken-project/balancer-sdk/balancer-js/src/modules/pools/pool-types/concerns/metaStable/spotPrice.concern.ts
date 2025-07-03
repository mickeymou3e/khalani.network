import { SpotPriceConcern } from '../types';
import { SubgraphPoolBase, MetaStablePool, ZERO } from '@hadouken-project/sor';
import { Pool } from '@/types';

export class MetaStablePoolSpotPrice implements SpotPriceConcern {
  calcPoolSpotPrice(tokenIn: string, tokenOut: string, pool: Pool): string {
    const metaStablePool = MetaStablePool.fromPool(pool as SubgraphPoolBase);
    const poolPairData = metaStablePool.parsePoolPairData(tokenIn, tokenOut);
    return metaStablePool
      ._spotPriceAfterSwapExactTokenInForTokenOut(poolPairData, ZERO)
      .toString();
  }
}
