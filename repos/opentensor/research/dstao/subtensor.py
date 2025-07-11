import torch
from pool import Pool
from wallet import Wallet, Wallets

class Subnet:
    def __init__(self, netuid: int):
        # Initialize a subnet with a unique identifier (netuid)
        self.netuid: int = netuid
        self.pool: Pool = Pool(netuid)  # Create a pool associated with this subnet
        self.wallets: Wallets = Wallets()  # Initialize wallets for the subnet
        self.num_validators: int = None  # Number of validators in the subnet
        self.num_miners: int = None  # Number of miners in the subnet
        self.domination: float = 0  # Domination factor of the subnet

    def add_liquidity(
        self, strategy: str = "scheduled", limit: float = 1.5, buying_rate: float = 5e-3
    ) -> bool:
        # Add liquidity to the pool based on the specified strategy
        if strategy == "scheduled" or (
            strategy == "limit" and (self.pool.price < self.domination * limit)
        ):
            for hk, w in self.wallets.wallets.items():
                tao = w.get_liquidity_to_add_to_pool(self.netuid) * buying_rate
                if tao > 0:
                    alpha = self.pool.buy(tao.item())
                    w.buy(self.netuid, tao, alpha)
            return True

    def remove_liquidity(self, selling_rate: float = 0.5) -> bool:
        # Remove liquidity from the pool at a given selling rate
        for hk, w in self.wallets.wallets.items():
            if w.SN_role[self.netuid] == "miner":
                alpha = w.latest_emission[self.netuid] * selling_rate
                w.latest_emission[self.netuid] = 0

                if alpha > 0:
                    tao = self.pool.sell(alpha)
                    w.sell(self.netuid, alpha, tao)

        return True

    def update_subnets_status(self, tao_sum: float) -> float:
        # Update the domination status of the subnet
        self.domination = self.pool.tao_in / tao_sum
        return self.domination

    def get_wallet_status(self):
        # Get the status of all wallets in the subnet
        return self.wallets.get_status()

    def get_hotkeys(self):
        # Retrieve all hotkeys associated with the wallets in the subnet
        return list(self.wallets.wallets.keys())


class Subtensor:
    def __init__(self):
        # Initialize a subtensor containing multiple subnets
        self.subnets: Dict[int, Subnet] = {}
        self.tao_sum: float = 0

    def get_tao_sum(self) -> float:
        # Calculate the total tao across all subnets
        tao_sum = 0
        for netuid, subnet in self.subnets.items():
            tao_sum += subnet.pool.tao_in
        self.tao_sum = tao_sum

        return tao_sum

    def update_subnets_status(self) -> bool:
        # Update the status of all subnets
        tao_sum = self.get_tao_sum()
        for netuid, subnet in self.subnets.items():
            subnet.update_subnets_status(tao_sum)
        return True

    def add_liquidity(
        self, strategy: str = "scheduled", limit: float = 1.5, buying_rate: float = 5e-3
    ) -> bool:
        # Add liquidity to all subnets using the specified strategy
        for netuid, subnet in self.subnets.items():
            subnet.add_liquidity(strategy, limit, buying_rate)
        return True

    def remove_liquidity(self, netuids: list, selling_rates: list) -> bool:
        # Remove liquidity from specified subnets
        for netuid, selling_rate in zip(netuids, selling_rates):
            subnet = self.subnets[netuid].remove_liquidity(selling_rate)
        return True

    def emit_to_subnets(
        self,
        strategy: str = "regular",
        taos: float = 1,
        price_regulation_factor: float = 0.5,
    ):
        # Emit tokens to subnets based on the chosen strategy
        if strategy == "regular":
            for netuid, subnet in self.subnets.items():
                subnet.pool.inject(taos * subnet.domination, taos, taos)
            return

        if strategy == "restricted":
            prices_sum = 0

            for netuid, subnet in self.subnets.items():
                prices_sum += subnet.pool.price

            if prices_sum >= 1:
                for netuid, subnet in self.subnets.items():
                    subnet.pool.inject(0, taos, taos)
            else:
                for netuid, subnet in self.subnets.items():
                    subnet.pool.inject(taos * subnet.domination, 0, taos)

        if strategy == "price_regulation":
            for netuid, subnet in self.subnets.items():
                reg = (
                    (subnet.pool.tao_in / subnet.domination - subnet.pool.alpha_in)
                    / taos
                    * price_regulation_factor
                )
                reg = max(reg, 1)
                subnet.pool.inject(taos * subnet.domination, taos * reg, taos * reg)

        if strategy == "do_not_emit":
            return

    def emit_to_hk(self, gamma: float, alpha_tokens: float, root_emission: float):
        # Emit tokens to hotkeys within each subnet
        for netuid, subnet in self.subnets.items():
            for hk, w in subnet.wallets.wallets.items():
                # Dividend (global dynamic tao)
                w.SN_token[subnet.netuid] += (
                    root_emission * alpha_tokens * 0.41 * gamma * w.global_dynamic_tao
                )

                # Dividend (local)
                w.SN_token[subnet.netuid] += (
                    (2 - root_emission)
                    * alpha_tokens
                    * 0.41
                    * (1 - gamma)
                    * w.SN_local_domination[subnet.netuid]
                )

                # Incentive
                if w.SN_role[subnet.netuid] == "miner":
                    w.SN_token[subnet.netuid] += alpha_tokens * 0.41 / subnet.num_miners
                    w.latest_emission[subnet.netuid] += (
                        alpha_tokens * 0.41 / subnet.num_miners
                    )

                # SN owner take
                if w.SN_owner[subnet.netuid]:
                    w.SN_token[subnet.netuid] += alpha_tokens * 0.18

    def get_domination(self) -> list:
        # Get the domination values for all subnets
        domination = []
        for netuid, subnet in self.subnets.items():
            domination.append(subnet.domination)
        return domination

    def get_tao_in(self) -> torch.Tensor:
        # Get the tao_in values for all pools
        tao_in = torch.zeros(52 + 1)
        for netuid, pool in self.get_pool().items():
            tao_in[netuid] = pool["tao_in"]
        return tao_in.nan_to_num(0)

    def get_pool(self) -> dict:
        # Retrieve the pool information for all subnets
        pools = {}
        for netuid, subnet in self.subnets.items():
            pools[netuid] = subnet.pool.to_dict()
        return pools

    def get_wallet_status(self) -> dict:
        # Get the status of wallets for all subnets
        status = {}
        for netuid, subnet in self.subnets.items():
            status[netuid] = subnet.get_wallet_status()
        return status

    def get_hotkeys(self) -> dict:
        # Retrieve hotkeys for all subnets
        hotkeys = {}
        for netuid, subnet in self.subnets.items():
            hotkeys[netuid] = subnet.get_hotkeys
