import prompts from 'prompts';

import { deploySingle as deploySingleScript, deployAll as deployAllScript } from '../../../scripts/godwoken/tokens/ERC20/batch.godwoken'
import { ERC20_CONTRACTS_DIR } from '../../../scripts/godwoken/tokens/ERC20/constants';
import { ERC20Data } from '../../../scripts/godwoken/tokens/ERC20/types';
import { TokenData } from '../../../scripts/godwoken/types';
import { getData, getDataPath } from '../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../types';

export const deployCli = async ({
    network,
    provider,
    wallet,
    transactionOverrides,
}: ScriptRunEnvironment) => {
    const erc20DataPath = getDataPath(ERC20_CONTRACTS_DIR)
    const erc20Data = getData<ERC20Data>(erc20DataPath)

    if (erc20Data) {
        const erc20Indexed = erc20Data.map((erc20, index) => ({ ...erc20, index }))

        const { index } = await prompts({
            type: 'select',
            name: 'index',
            message: 'Select deploy',
            choices: [
                ...(erc20Indexed.map(({ index, ...erc20 }) => ({
                    value: index,
                    title: erc20.symbol,
                }))),
                { title: 'all', value: 'all' },
            ],
        });

        switch(index) {
            case 'all':
                await deployAllScript(network, wallet, transactionOverrides)
                break
            default: {
                const { name, symbol, decimals } = erc20Indexed[index]
                await deploySingleScript(name, symbol, decimals, network, wallet, transactionOverrides)
            }
        }
    }
}