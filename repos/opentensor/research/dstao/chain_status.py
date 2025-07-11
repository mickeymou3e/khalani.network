import torch
import numpy as np
import os


class ChainStatus:
    def __init__(self, block: int, metagraph_storage_path: str, substrate, subtensor):
        """
        Initialize the ChainStatus object with necessary parameters and load data.

        :param block: The block number to process.
        :param metagraph_storage_path: Path where metagraph files are stored.
        :param substrate: Substrate interface for blockchain interaction.
        :param subtensor: Subtensor interface for neural network interaction.
        """
        self.metagraph_storage_path = metagraph_storage_path
        self.substrate = substrate
        self.subtensor = subtensor
        self.download_metagraph(block)
        self.metas = self.load_metagraph(block)
        self.subnet_emission = self.get_subnet_emission(self.metas, block)
        self.root_weight = self.get_root_weight(block)
        self.subnet_owners = self.get_subnet_owners()
        self.root_validators = self.get_root_validators()

    def download_metagraph(self, block: int):
        """
        Download the metagraph for each netuid if not already downloaded.

        :param block: The block number to process.
        """
        for netuid in range(52):
            file_name = f"{self.metagraph_storage_path}/netuid{netuid}_block{block}.pt"
            if os.path.isfile(file_name):
                continue
            else:
                meta = self.subtensor.metagraph(netuid=netuid, lite=True)
                torch.save(meta, file_name)

    def load_metagraph(self, block: int) -> dict:
        """
        Load the metagraph from storage for each netuid.

        :param block: The block number to process.
        :return: A dictionary of loaded metagraphs.
        """
        metas = {}
        for netuid in range(52):
            file_name = f"{self.metagraph_storage_path}/netuid{netuid}_block{block}.pt"
            metas[netuid] = torch.load(file_name)

        return metas

    def get_tempos(self, block: int) -> dict:
        """
        Retrieve tempos from the substrate for a given block.

        :param block: The block number to process.
        :return: Tempos retrieved from the substrate.
        """
        block_hash = self.substrate.get_block_hash(block)
        tempos = self.substrate.query_map(
            "SubtensorModule", "Tempo", block_hash=block_hash
        )
        return tempos

    def get_subnet_emission(self, metas: dict, block: int) -> torch.Tensor:
        """
        Calculate subnet emissions based on metagraph data and tempos.

        :param metas: Metagraph data for each netuid.
        :param block: The block number to process.
        :return: Tensor of subnet emissions.
        """
        emissions = np.array([])
        tempos = self.get_tempos(block)
        for netuid in range(52):
            meta = metas[netuid]
            emissions = np.append(
                emissions, meta.E.sum() / (tempos[netuid][1].value * 0.82)
            )
        return torch.tensor(emissions).nan_to_num(0)

    def get_root_weight(self, block: int) -> torch.Tensor:
        """
        Calculate root weights from raw weight data.

        :param block: The block number to process.
        :return: Tensor of root weights.
        """
        raw_root_weight = self.subtensor.weights(0, block=block)
        root_weight = torch.zeros(len(raw_root_weight) + 1, 52 + 1)

        for matrix in raw_root_weight:
            uid = matrix[0]
            for weight_data in matrix[1]:
                root_weight[uid, weight_data[0]] = weight_data[1]
        root_weight = (root_weight.T / root_weight.sum(dim=1)).T

        return root_weight.nan_to_num(0)

    def get_subnet_owners(self) -> list:
        """
        Retrieve the owners of each subnet.

        :return: List of subnet owners.
        """
        subnet_owners = []
        for netuid in range(52):
            result = self.substrate.query("SubtensorModule", "SubnetOwner", [netuid])
            subnet_owners.append(result.value)
        return subnet_owners

    def get_root_validators(self) -> list:
        """
        Retrieve the hotkeys of root validators.

        :return: List of root validator hotkeys.
        """
        rn = self.subtensor.neurons_lite(netuid=0)
        return [n.hotkey for n in rn]
