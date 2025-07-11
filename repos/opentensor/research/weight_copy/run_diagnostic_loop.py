
import os 
from multiprocessing import Pool
import torch 
import pandas as pd
from matplotlib.pyplot import figure
import bittensor as bt
from tqdm import tqdm
import pickle
from experiment_setup import ExperimentSetup
import plotly.express as px
import numpy as np
import matplotlib.pyplot as plt


def get_div_losts(setup):
    div_losts = {}
    divs = {}
    yuma_results = {}

    for netuid in setup.netuids:
        div_losts[netuid] = {}
        divs[netuid] = {}
        yuma_results[netuid] = {}
        
        for conceal_period in setup.conceal_periods:
            with open(f"{setup.result_path}/yuma_result_netuid{netuid}_conceal{conceal_period}.pkl", 'rb') as handle:
                _yuma_results = pickle.load(handle)

            dividend = [
                (s["validator_reward_normalized"] / s["stake"]).tolist()
                for idx, s in _yuma_results.items()
            ]

            dividend_df = pd.DataFrame(
                dividend,
                columns=[f"v{i}" for i in range(len(dividend[0]) - 1 )] + ["v_bad"],
                index = _yuma_results.keys()
            )
            
            div_last = dividend_df.iloc[-1]
            if (div_last.isna()).any():
                div_lost = None
            else:
                div_lost = div_last[-1] / div_last[:-1].median()

            divs[netuid][conceal_period] = div_last
            div_losts[netuid][conceal_period] = div_lost
            yuma_results[netuid][conceal_period] = _yuma_results

    div_losts = pd.DataFrame(div_losts, dtype='float64')
    div_losts.index = div_losts.index.map(lambda x : x)

    return div_losts, divs, yuma_results

def get_min_conceal_period(div_losts):
    df = []
    for netuid in div_losts:
        min_conceal_period = None
        for conceal_period, div_lost in div_losts[netuid].items():
            
            if div_lost < 1:
                min_conceal_period = conceal_period
                break

        df.append((netuid, min_conceal_period))

    min_conceal_period = pd.DataFrame(df, columns = ['netuid', 'crw_interval'])
    min_conceal_period = min_conceal_period.set_index('netuid').sort_values('crw_interval')
    return min_conceal_period


# for netuid in range(2, 36):
#     netuid = 10

def main(netuid=None):
    
    la_setups = {}

    data_points = 60

    la_setups['org'] = ExperimentSetup(
        netuids = [netuid],
        processes=8,
        data_points=data_points,
        result_path=f'./weight_copy_results',
    )

    for alpha_low in np.arange(0.1, 0.95, 0.2):
        la_setups[alpha_low] = ExperimentSetup(
            netuids = [netuid],
            processes=8,
            data_points=data_points,
            result_path=f'./liquid_alpha_results_al{alpha_low:.2f}',
            liquid_alpha = True, 
            alpha_low = alpha_low,
        )

    ### Download metagraphs

    from download_metagraphs import DownloadMetagraph
    DownloadMetagraph(setup = la_setups['org']).run()

    # %%time

    from weight_copy_simulation import WeightCopySimulation

    for alpha_low, _setup in la_setups.items():
        WeightCopySimulation(setup = _setup).run_simulation()



    min_conceal_period = None
    divs = {}

    for name, _setup in la_setups.items():
        _div_losts, _, _yuma_results = get_div_losts(_setup)

        if min_conceal_period is None:
            min_conceal_period = get_min_conceal_period(_div_losts)

        else:
            min_conceal_period = min_conceal_period.join(get_min_conceal_period(_div_losts), rsuffix=f"_{name}")

    divs = {}
    optimal_conceal_period = min_conceal_period.loc[netuid].min()
    for name, _setup in la_setups.items():
        _div_losts, _divs, _yuma_results = get_div_losts(_setup)
        divs[name] = _divs[netuid][optimal_conceal_period]
        

    df = pd.DataFrame(divs).drop('v2')

    plt.plot(df.iloc[:-1, 1:].median(), label = 'dividend change for honest validators')
    plt.plot(df.iloc[-1, 1:], label = 'dividend change for weight copier')
    plt.title(f'netuid: {netuid}')
    plt.legend()
    plt.gcf().set_size_inches(12,8)
    plt.savefig(f'honest_VS_copier_{netuid}.png')
    plt.clf()
    
if __name__ == '__main__':
    for i in range(14, 36):
        try:
            main(i)
        except:
            print('fuck')
            continue
