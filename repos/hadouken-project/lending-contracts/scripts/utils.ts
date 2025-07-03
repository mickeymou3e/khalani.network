import { LendingPoolLibraryAddresses } from '@src/typechain/godwoken/factories/LendingPool__factory';

export const parseLibrariesAddressToContractData = (
  reserveLogicAddress: string,
  validationLogicAddress: string
): LendingPoolLibraryAddresses => {
  return {
    ['contracts/protocol/libraries/logic/ValidationLogic.sol:ValidationLogic']:
      validationLogicAddress,
    ['contracts/protocol/libraries/logic/ReserveLogic.sol:ReserveLogic']: reserveLogicAddress,
  };
};
