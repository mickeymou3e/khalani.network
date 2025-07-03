import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'

export class InitializeStoreState implements IInitializeSaga {
  public status: RequestStatus
}
