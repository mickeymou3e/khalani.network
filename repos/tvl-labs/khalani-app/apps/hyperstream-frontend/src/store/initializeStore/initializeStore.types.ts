import { IInitializeSaga } from '@shared/interfaces'
import { RequestStatus } from '@tvl-labs/sdk'

export class InitializeStoreState implements IInitializeSaga {
  public status: RequestStatus
}
