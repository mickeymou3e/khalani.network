import { runSaga, useReduxSelector } from '@store/store.utils'
import { safeSelector } from '@store/safe/safe.selector'
import { updateSafeStateSaga } from '@store/safe/saga/update.saga'
import { createSafeSaga } from '@store/safe/saga/create.saga';

export class Safe {
  async update() {
    await runSaga(updateSafeStateSaga);
  }

  getAddress() {
    return useReduxSelector(safeSelector.address);
  }

  isDeployed() {
    return useReduxSelector(safeSelector.deployed);
  }

  async ensureDeployed() {
    await this.update();

    if (this.isDeployed()) {
      return;
    }

    await runSaga(createSafeSaga);
    await this.update();
  }
}
