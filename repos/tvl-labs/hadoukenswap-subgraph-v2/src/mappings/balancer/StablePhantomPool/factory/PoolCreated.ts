import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";
import {StablePhantomPool as StablePhantomPoolTemplate} from "../../../../types/templates";

import {PoolType} from "../../helpers/pools";
import {createStableLikePool} from "../../StablePool/factory/PoolCreated";

export function handleStablePhantomPoolCreated(event: PoolCreated): void {
    const pool = createStableLikePool(event, PoolType.StablePhantom);
    if (pool == null) return;
    StablePhantomPoolTemplate.create(event.params.pool);
}




