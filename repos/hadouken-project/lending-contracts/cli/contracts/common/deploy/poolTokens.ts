import { deployPoolTokens } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployPoolTokensCli = async (environment: ScriptRunEnvironment) => {
  const tokens = await deployPoolTokens(environment);
  return tokens;
};
