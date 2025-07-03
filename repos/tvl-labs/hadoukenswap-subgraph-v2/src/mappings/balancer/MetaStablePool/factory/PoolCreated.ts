import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";
import {PoolType} from "../../helpers/pools";
import {MetaStablePool as MetaStablePoolTemplate} from '../../../../types/templates';

import {createStableLikePool} from "../../StablePool/factory/PoolCreated";

export function handleMetaStablePoolCreated(event: PoolCreated): void {
    const pool = createStableLikePool(event, PoolType.MetaStable);
    if (pool == null) return;
    MetaStablePoolTemplate.create(event.params.pool);
}
