import { deployRegisterProvider } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployRegistryProviderCli = async (environment: ScriptRunEnvironment) => {
  await deployRegisterProvider(environment);
};
