import prompts from 'prompts';

import { ScriptRunEnvironment } from '../../../types';

import { list } from './list'

const allRegistriesCli = async (environment: ScriptRunEnvironment) => {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'list', value: 'list'}
        ],
    })

    switch(action) {
        case 'list':
            await list(environment)
            break
        default:
            break
    }
}

export default allRegistriesCli;