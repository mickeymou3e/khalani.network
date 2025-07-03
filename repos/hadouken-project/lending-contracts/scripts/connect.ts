import { connectGodwoken, connectMantle, connectZkSync } from '@src/connect';
import { isGodwokenNetwork, isMantleNetwork, isZkSyncNetwork } from '@src/network';
import { ScriptRunEnvironment, ZkSyncDeploymentEnvironment } from '@src/types';

export const connectToContracts = (
  runEnvironment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(runEnvironment.chainId)) {
    return connectZkSync((runEnvironment as ScriptRunEnvironment).deployer, runEnvironment.env);
  } else if (isGodwokenNetwork(runEnvironment.chainId)) {
    return connectGodwoken((runEnvironment as ScriptRunEnvironment).deployer, runEnvironment.env);
  } else if (isMantleNetwork(runEnvironment.chainId)) {
    return connectMantle((runEnvironment as ScriptRunEnvironment).deployer, runEnvironment.env);
  }

  throw Error('[connectToContracts] - Network not found');
};

export const connectToContractsRuntime = (
  runEnvironment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(runEnvironment.chainId)) {
    return connectZkSync(
      (runEnvironment as ZkSyncDeploymentEnvironment).walletWithProvider,
      runEnvironment.env,
      true
    );
  } else if (isGodwokenNetwork(runEnvironment.chainId)) {
    return connectGodwoken(
      (runEnvironment as ScriptRunEnvironment).deployer,
      runEnvironment.env,
      true
    );
  } else if (isMantleNetwork(runEnvironment.chainId)) {
    return connectMantle(
      (runEnvironment as ScriptRunEnvironment).deployer,
      runEnvironment.env,
      true
    );
  }

  throw Error('[connectToContractsRuntime] - Network not found');
};
