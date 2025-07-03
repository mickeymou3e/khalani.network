import { IPool } from '@interfaces/pool'

import { IPoolService, IPoolServiceProvider } from './types'

export class PoolServiceProvider implements IPoolServiceProvider {
  private providers: IPoolServiceProvider[]
  constructor(providers: IPoolServiceProvider[]) {
    this.providers = providers
  }

  provide(pool: IPool): IPoolService | null {
    const provider = this.providers.find((provider) => provider.provide(pool))

    if (!provider) {
      return null
    }

    return provider.provide(pool)
  }
}
