from typing import List
from dataclasses import dataclass, field
import torch

from wallet import Wallet, Wallets
from subtensor import Subnet, Subtensor

import bittensor as bt
from substrateinterface import SubstrateInterface

from chain_status import ChainStatus

from multiprocessing import Process, Manager


@dataclass
class ExperimentSetup:
    # timing
    days: int = 365
    tempo: int = 7200
    block_time: int = 12

    # create subnet
    init_subnet_strategy: str = "sync_metagraph"
    subnet_weight: List[float] = field(default_factory=list)  # [num of SN]

    # create hotkey
    active_tao_rates: List[float] = field(default_factory=list)  # num of wallets
    record_hk: List[float] = field(default_factory=list)  # num of wallets

    # emissoin
    emission_strategy: str = "regular"
    price_regulation_factor: float = 0.5
    gamma: bool = True
    root_emission: float = 1

    # buying
    buying_days: int = 30
    buying_rate: float = None
    buying_strategy: str = "scheduled"
    limit: float = 5

    # selling
    sell: bool = False
    selling_rate: List[float] = field(default_factory=list)


class Experiment:
    def __init__(self, exp, chain_status):
        self.exp = exp
        self.chain_status = chain_status
        self.wallets, self.subtensor = self.init_wallets_subtensor(
            exp.init_subnet_strategy,
            chain_status,
            exp.subnet_weight,
            exp.active_tao_rates,
        )

    def create_subnet(self, netuid, wallets, weight, active_tao_rates):
        subnet = Subnet(netuid)
        active_tao_rates = active_tao_rates + [0.5] * (256 - len(active_tao_rates))
        for uid, active_tao_rate in enumerate(active_tao_rates):
            if uid < 10:
                role = "validator"
                stake = torch.tensor(700_000, dtype=torch.float64)
            else:
                role = "miner"
                stake = torch.tensor(0, dtype=torch.float64)

            if uid == 0:
                is_subnet_owner = True
            else:
                is_subnet_owner = False

            if uid == 0:
                hk = f"owner_{uid}"
            elif uid < 10:
                hk = f"validator_{uid}"
            else:
                hk = f"miner_{uid}"

            if hk not in wallets.wallets:
                wallets.wallets[hk] = Wallet(hk, stake, active_tao_rate)

            wallets.wallets[hk].init_SN(netuid, role, is_subnet_owner)

            wallets.wallets[hk].SN_weight = weight

            subnet.wallets.wallets[hk] = wallets.wallets[hk]

        subnet.num_validators = 10
        subnet.num_miners = 246

        return wallets, subnet

    def sync_subnet(self, netuid, wallets, meta, active_tao_rate=0.5):
        subnet = Subnet(netuid)
        for uid, hk, stake in zip(meta.uids, meta.hotkeys, meta.stake):
            if meta.validator_trust[uid] > 0:
                role = "validator"
            else:
                role = "miner"

            if self.chain_status.subnet_owners[netuid] == hk:
                is_subnet_owner = True
            else:
                is_subnet_owner = False

            if hk not in wallets.wallets:
                wallets.wallets[hk] = Wallet(hk, stake, active_tao_rate=0.5)

            wallets.wallets[hk].init_SN(netuid, role, is_subnet_owner)

            if hk in self.chain_status.root_validators[:63]:
                wallets.wallets[hk].SN_weight = self.chain_status.root_weight[
                    self.chain_status.root_validators.index(hk)
                ]
            else:
                wallets.wallets[hk].SN_weight = self.chain_status.subnet_emission

            wallets.wallets[hk].active_tao_rate = active_tao_rate

            subnet.wallets.wallets[hk] = wallets.wallets[hk]

        subnet.num_validators = sum(meta.validator_trust > 0)
        subnet.num_miners = sum(meta.validator_trust == 0)
        return wallets, subnet

    def init_wallets_subtensor(
        self,
        strategy="sync_metagraph",
        chain_status=None,
        weights=[],
        active_tao_rates=[],
    ):
        wallets = Wallets()
        subtensor = Subtensor()

        if strategy == "sync_metagraph":
            for netuid, meta in chain_status.metas.items():
                wallets, subtensor.subnets[netuid] = self.sync_subnet(
                    netuid, wallets, meta
                )

        elif strategy == "create":
            weights = torch.tensor([w / sum(weights) for w in weights])
            for netuid in range(len(weights)):
                wallets, subtensor.subnets[netuid] = self.create_subnet(
                    netuid, wallets, weights, active_tao_rates
                )
        return wallets, subtensor

    def get_miners(self, wallets):
        miners = []
        for netuid in range(52):
            for hk, w in wallets.wallets.items():
                if netuid in w.SN_role and w.SN_role[netuid] == "miner":
                    miners.append(hk)
                    break

        return miners

    def run_simulate(self, exp_id, return_dict):
        process = Process(
            target=self.simulate,
            args=(
                exp_id,
                return_dict,
            ),
        )
        process.start()
        return process

    def simulate(self, exp_id, return_dict):
        print(f"started {self.exp}\n")

        blocks_per_day = 3600 * 24 / self.exp.block_time
        tempo_step_to_buy = self.exp.buying_days * (blocks_per_day / self.exp.tempo)

        if self.exp.buying_rate == None:
            buying_rate = 1 / tempo_step_to_buy  # portion to buy per tempo
        else:
            buying_rate = self.exp.buying_rate

        steps_per_year = blocks_per_day / self.exp.tempo * 365
        total_steps = round(blocks_per_day / self.exp.tempo * self.exp.days)
        results = []

        miners = self.get_miners(self.wallets)

        for tempo_step in range(total_steps):  # 1 step = 1 tempo
            # update subnet status
            self.subtensor.update_subnets_status()

            # update wallet status
            self.wallets.update_wallet_status(self.subtensor.get_tao_in())

            # emit to subnet
            self.subtensor.emit_to_subnets(
                taos=1 * self.exp.tempo,
                strategy=self.exp.emission_strategy,
                price_regulation_factor=self.exp.price_regulation_factor,
            )

            # emit to wallet
            self.subtensor.emit_to_hk(
                alpha_tokens=1 * self.exp.tempo,
                gamma=1 - 0.5 * tempo_step / steps_per_year if self.exp.gamma else 0.5,
                root_emission=self.exp.root_emission,
            )

            # add liquidity by staking
            self.subtensor.add_liquidity(
                strategy=self.exp.buying_strategy,
                limit=self.exp.limit,
                buying_rate=buying_rate,
            )

            # remove liquidity by miners selling
            if self.exp.sell:
                self.subtensor.remove_liquidity(
                    netuids=list(self.subtensor.subnets.keys()),
                    selling_rates=self.exp.selling_rate,
                )

            result = {
                "buying_days": self.exp.buying_days,
                "tempo": tempo_step,
                "block": tempo_step * self.exp.tempo,
                "emission": self.subtensor.get_domination(),
                "pool": self.subtensor.get_pool(),
                "wallet_status": self.wallets.get_status(
                    required=self.exp.record_hk + miners
                ),
                "hotkeys": self.subtensor.get_hotkeys(),
            }

            results.append(result)

        print(f"finished {self.exp}\n")

        return_dict[exp_id] = [self.exp, results]
        return


class Experiments:
    def __init__(self, block, metagraph_storage_path, exps):
        self.block = block
        self.exps = exps
        self.metagraph_storage_path = metagraph_storage_path
        self.subtensor = bt.subtensor("archive")
        self.substrate = SubstrateInterface(
            url="wss://archive.chain.opentensor.ai:443/",
            ss58_format=42,
            type_registry_preset="legacy",
        )
        self.chain_status = ChainStatus(
            self.block, self.metagraph_storage_path, self.substrate, self.subtensor
        )

    def run(self):
        with Manager() as manager:
            return_dict = manager.dict()

            processes = []
            for exp_id, exp in enumerate(self.exps):
                processes.append(
                    Experiment(exp, self.chain_status).run_simulate(exp_id, return_dict)
                )

            for p in processes:
                p.join()

            return dict(return_dict)
