import torch
from typing import Dict

class Wallet:
    def __init__(self, hotkey: str, tao: float, active_tao_rate: float = 0.5):
        # Initialize wallet with a hotkey, tao balance, and an active tao rate
        self.hotkey: str = hotkey
        self.tao: float = tao
        self.active_tao_rate: float = active_tao_rate
        self.SN_token: torch.tensor = torch.zeros(52 + 1) * 1e-9
        self.SN_tao_spent: torch.tensor = torch.zeros(52 + 1)  # Tao put into the pool to swap to alpha
        self.SN_local_domination: torch.tensor = torch.zeros(52 + 1)
        self.latest_emission: torch.tensor = torch.zeros(52 + 1)
        self.SN_weight: torch.tensor = torch.zeros(52 + 1)
        self.SN_role: Dict[int, str] = {}
        self.SN_owner: Dict[int, bool] = {}

    def init_SN(self, netuid: int, role: str, subnet_owner: bool = False):
        # Initialize subnet with a role and ownership status
        self.SN_role[netuid] = role
        self.SN_owner[netuid] = subnet_owner

    def buy(self, netuid: int, tao: float, alpha: float):
        # Buy operation: decrease tao and increase SN_token for a given netuid
        if self.tao - tao <= 0:
            return
        self.tao -= tao
        self.SN_tao_spent[netuid] -= tao
        self.SN_token[netuid] += alpha

    def sell(self, netuid: int, alpha: float, tao: float):
        # Sell operation: increase tao and decrease SN_token for a given netuid
        if self.SN_token[netuid] - alpha <= 0:
            return
        self.tao += tao
        self.SN_tao_spent[netuid] += tao
        self.SN_token[netuid] -= alpha

    def update_wallet_status(self, tao_sum: float, tao_in: torch.tensor, alpha_sum: torch.tensor):
        # Update wallet status based on tao and alpha sums
        self.SN_local_domination = (self.SN_token / alpha_sum).nan_to_num(0)
        self.SN_local_domination_sum = (self.SN_local_domination * (tao_in / tao_in.sum())).sum() if tao_in.sum() > 0 else 0
        self.global_dynamic_tao = self.tao / tao_sum + self.SN_local_domination_sum if tao_sum > 0 else 0

    def get_liquidity_to_add_to_pool(self, netuid: int) -> float:
        # Calculate liquidity to add to the pool for a given netuid
        if self.SN_tao_spent.sum() * -1 < (self.tao + self.SN_tao_spent.sum() * -1) * self.active_tao_rate:
            return max(0, self.tao * self.SN_weight[netuid])
        else:
            return 0

    def get_status(self) -> Dict[str, any]:
        # Get the current status of the wallet
        return {
            'hotkey': self.hotkey,
            'tao': self.tao,
            'global_dynamic_tao': self.global_dynamic_tao,
            'SN_token': self.SN_token.tolist(),
            'SN_tao_spent': self.SN_tao_spent.tolist(),
            'SN_local_domination': self.SN_local_domination.tolist(),
            'SN_local_domination_sum': self.SN_local_domination_sum,
            'SN_weight': self.SN_weight.tolist(),
            'SN_role': self.SN_role,
            'SN_owner': self.SN_owner
        }

class Wallets:
    def __init__(self):
        # Initialize a collection of wallets
        self.wallets: Dict[str, Wallet] = {}
        self.alpha_sum: torch.tensor = torch.tensor(0)
        self.tao_sum: float = 0

    def get_tao_sum(self) -> float:
        # Calculate the total tao across all wallets
        tao = sum(w.tao for w in self.wallets.values())
        self.tao_sum = tao
        return tao

    def normalize_global_dynamic_tao(self):
        # Normalize global dynamic tao across all wallets
        gdt_sum = sum(w.global_dynamic_tao for w in self.wallets.values())
        for w in self.wallets.values():
            w.global_dynamic_tao /= gdt_sum

    def get_alpha_out_sum(self) -> torch.tensor:
        # Calculate the total alpha output across all wallets
        alphas = [w.SN_token for w in self.wallets.values()]
        self.alpha_out_sum = torch.stack(alphas).sum(dim=0)
        return self.alpha_out_sum

    def update_wallet_status(self, tao_in: torch.tensor):
        # Update the status of each wallet
        self.get_tao_sum()
        self.get_alpha_out_sum()
        for w in self.wallets.values():
            w.update_wallet_status(self.tao_sum, tao_in, self.alpha_out_sum)
        self.normalize_global_dynamic_tao()

    def get_status(self, required: list = []) -> Dict[str, Dict[str, any]]:
        # Get the status of specified wallets or all if none specified
        if required:
            return {hk: w.get_status() for hk, w in self.wallets.items() if hk in required}
        else:
            return {hk: w.get_status() for hk, w in self.wallets.items()}