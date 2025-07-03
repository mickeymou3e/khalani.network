import prompts from 'prompts';

import { ComposableStablePoolTemplateCreateCli } from './create';

import { Cli } from '../../../types';

const ComposableStablePoolFactoryCli: Cli = async ({ environment, parentCli }) => {
  const choices = [{ title: 'template create', value: 'template' }];

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case 'template':
      await ComposableStablePoolTemplateCreateCli({
        environment: environment,
        parentCli: ComposableStablePoolFactoryCli,
      });
      break;
  }

  return ComposableStablePoolFactoryCli({ environment, parentCli });
};

export default ComposableStablePoolFactoryCli;
