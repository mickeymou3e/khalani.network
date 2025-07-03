import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";
import {PoolType} from "../../helpers/pools";

import {handleLinearPoolCreated} from "../../LinearPool/factory/PoolCreated";

export function handleAaveLinearPoolCreated(event: PoolCreated): void {
    handleLinearPoolCreated(event, PoolType.AaveLinear);
}