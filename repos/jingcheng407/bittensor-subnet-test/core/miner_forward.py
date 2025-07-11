import bittensor as bt
from core.protocol import EFProtocol


async def forward(
        uid_str, synapse: EFProtocol
) -> EFProtocol:
    """
    Processes the incoming 'Dummy' synapse by performing a predefined operation on the input data.
    This method should be replaced with actual logic relevant to the miner's purpose.

    Args:
        synapse (template.protocol.Dummy): The synapse object containing the 'dummy_input' data.

    Returns:
        template.protocol.Dummy: The synapse object with the 'dummy_output' field set to twice the 'dummy_input' value.

    The 'forward' function is a placeholder and should be overridden with logic that is appropriate for
    the miner's intended operation. This method demonstrates a basic transformation of input data.
    """

    bt.logging.info(f"miner forward()")
    synapse.output = {'tt_uid': uid_str}
    bt.logging.info(f'my tt_uid {uid_str},data from validator: ', synapse.input)
    return synapse
