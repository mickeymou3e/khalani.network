# The MIT License (MIT)
# Copyright © 2023 Yuma Rao

# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the “Software”), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.

# THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
# THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

import time
import bittensor as bt

from core.protocol import EFProtocol
from core.validator_reward import get_rewards
from _sdk.template.utils.uids import get_random_uids


async def forward(self):
    """
    The forward function is called by the validator every time step.

    It is responsible for querying the network and scoring the responses.

    Args:
        self (:obj:`bittensor.neuron.Neuron`): The neuron object which contains all the necessary state for the validator.

    """
    num_uids = 10
    miner_uids = get_random_uids(self, k=num_uids)
    bt.logging.info(f"Selected miner uids: {miner_uids}")
    [bt.logging.info(f"miner_uid:{miner_uid}, "
                     f"{self.metagraph.axons[miner_uid].ip + ':' + str(self.metagraph.axons[miner_uid].port)}")
     for miner_uid in miner_uids]
    # The dendrite client queries the network.
    responses = await self.dendrite(
        # Send the query to selected miner axons in the network.
        axons=[self.metagraph.axons[uid] for uid in miner_uids],
        # Construct a dummy query. This simply contains a single integer.
        # synapse=Dummy(dummy_input=self.step),
        synapse=EFProtocol(dummy_input={'json_from_validator': 888}),
        # All responses have the deserialize function called on them before returning.
        # You are encouraged to define your own deserialization function.
        deserialize=True,
    )

    # Log the results for monitoring purposes.
    bt.logging.info(f"Received responses: {responses}")

    # TODO(developer): Define how the validator scores responses.
    # Adjust the scores based on responses from miners.
    rewards = get_rewards(self, query=self.step, responses=responses)

    bt.logging.info(f"Scored responses: {rewards}")
    # Update the scores based on the rewards. You may want to define your own update_scores function for custom behavior.
    self.update_scores(rewards, miner_uids)
    time.sleep(60)
