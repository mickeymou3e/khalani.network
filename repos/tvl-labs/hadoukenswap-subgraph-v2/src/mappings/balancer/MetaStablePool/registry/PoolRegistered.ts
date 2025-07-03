import { PoolType } from '../../helpers/pools'

import {MetaStablePool as MetaStablePoolTemplate} from '../../../../types/templates'
import {createStableLikePool} from "../../poolFactory";
// import {PoolRegistered} from "../../../../types/MetaStablePoolRegistry/MetaStablePoolRegistry";
import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";
import {ZERO_ADDRESS} from "../../helpers/constants";


// function registerStableLikePool(event: PoolRegistered): void {
//   let poolId = createStableLikePool(
//       new PoolCreated(
//           event.address,
//           event.logIndex,
//           event.transactionLogIndex,
//           event.logType,
//           event.block,
//           event.transaction,
//           event.parameters,
//       ),
//       PoolType.MetaStable
//   )
//
//   MetaStablePoolTemplate.create(event.params.pool)
// }

// export function handleNewMetaStablePoolRegistered(event: PoolRegistered): void {
    export function handleNewMetaStablePoolRegistered(): void {
    // const pool = event.params.pool
    //
    // if (pool != ZERO_ADDRESS) {
    //     registerStableLikePool(event)
    // }
}
