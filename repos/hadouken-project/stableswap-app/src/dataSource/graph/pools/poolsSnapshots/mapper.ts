import {
  IPoolSnapshot,
  IPoolSnapshotQueryResultData,
} from '@dataSource/graph/pools/poolsSnapshots/types'
import { IPool } from '@interfaces/pool'
import { ByPoolId } from '@store/pool/pool.types'
import { BigDecimal } from '@utils/math'

export function mapPoolSnapshotQueryResultDataToPoolSnapshots(
  poolIds: IPool['id'][],
  { poolSnapshotQueryResult }: IPoolSnapshotQueryResultData,
): ByPoolId<IPoolSnapshot[]> {
  return poolIds.reduce((poolSnapshotsByPoolId, poolId) => {
    const poolSnapshots = poolSnapshotQueryResult?.filter(
      ({ id }) => id === poolId,
    )

    return {
      ...poolSnapshotsByPoolId,
      [poolId]: poolSnapshots.map((poolSnapshot) => ({
        id: poolSnapshot?.id ?? poolId,
        totalLiquidity: poolSnapshot
          ? BigDecimal.fromString(poolSnapshot?.totalLiquidity)
          : BigDecimal.from(0),
        totalSwapFee: poolSnapshot.totalSwapFee
          ? BigDecimal.fromString(poolSnapshot?.totalSwapFee)
          : BigDecimal.from(0),
        totalSwapVolume: poolSnapshot?.totalSwapVolume
          ? BigDecimal.fromString(poolSnapshot?.totalSwapVolume)
          : BigDecimal.from(0),
        totalShares: poolSnapshot?.totalShares
          ? BigDecimal.fromString(poolSnapshot?.totalShares)
          : BigDecimal.from(0),
      })),
    }
  }, {} as ByPoolId<IPoolSnapshot[]>)
}
