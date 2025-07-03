import prompts from 'prompts';

import { Cli } from '../../../types';
import { AaveLinearPoolCreateCli, AaveLinearPoolTemplateCreateCli } from './create';

const AaveLinearPoolFactoryCli: Cli = async ({ environment, parentCli }) => {
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
      await AaveLinearPoolCreateCli({ environment: environment, parentCli: AaveLinearPoolFactoryCli });
      break;
    case 'template':
      await AaveLinearPoolTemplateCreateCli({ environment: environment, parentCli: AaveLinearPoolFactoryCli });
      break;
  }

  return AaveLinearPoolFactoryCli({ environment, parentCli });
};

export default AaveLinearPoolFactoryCli;
