import prompts from 'prompts';

import { Cli } from '../../../types';
import { WeightedPoolCustomCreateCli, WeightedPoolTemplateCreateCli } from './create';

const WeightedPoolFactoryCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'custom create', value: 'custom' },
    { title: 'template create', value: 'template' },
  ];

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
    case 'custom':
      await WeightedPoolCustomCreateCli({ environment: environment, parentCli: WeightedPoolFactoryCli });
      break;
    case 'template':
      await WeightedPoolTemplateCreateCli({ environment: environment, parentCli: WeightedPoolFactoryCli });
      break;
  }

  return WeightedPoolFactoryCli({ environment, parentCli });
};

export default WeightedPoolFactoryCli;
