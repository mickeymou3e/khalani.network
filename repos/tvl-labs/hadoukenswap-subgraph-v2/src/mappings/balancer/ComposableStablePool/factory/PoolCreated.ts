import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";
import {PoolType} from "../../helpers/pools";
import {ComposableStablePool as ComposableStablePoolTemplate} from "../../../../types/templates";
import {createStableLikePool} from "../../StablePool/factory/PoolCreated";

export function handleComposableStablePoolCreated(event: PoolCreated): void {
    const pool = createStableLikePool(event, PoolType.ComposableStable);
    if (pool == null) return;
    ComposableStablePoolTemplate.create(event.params.pool);
}