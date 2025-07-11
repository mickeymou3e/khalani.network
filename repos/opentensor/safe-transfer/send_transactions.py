import os
import json
import copy
import logging
import argparse
import tqdm as tqdm
import bittensor as bt
from substrateinterface.exceptions import SubstrateRequestException
from substrateinterface.base import ExtrinsicReceipt
from bittensor.btlogging import logging as _logger

# First let's get the wallet from the command line.
parser = argparse.ArgumentParser('safe transfer command')
bt.subtensor.add_args( parser )
config = bt.config( parser )

# First check that we can reach the chain.
_logger.off()
sub = bt.subtensor(config.subtensor.chain_endpoint)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a dictionary to act as a simple persistent database
database = {}
arbitration = {}

# Load the database from a file if it exists
def load_database():
    if os.path.exists('database.json'):
        with open('database.json', 'r') as db_file:
            return json.load(db_file)
    return {}

# Load the database
database = load_database()
logger.info('Database loaded.')

wait_for_finalization = True
wait_for_inclusion = True

# Send transactions to the chain.
db_keys = list( database.keys() )
for user_UID in tqdm( db_keys ):
    transactions = copy.deepcopy( database[user_UID] )
    for transfer in transactions:
        
        def result_handler(message, update_nr, subscription_id):
            # Check if extrinsic is included and finalized
            if 'params' in message and type(message['params']['result']) is dict:

                # Convert result enum to lower for backwards compatibility
                message_result = {k.lower(): v for k, v in message['params']['result'].items()}

                if 'finalized' in message_result and wait_for_finalization:
                    sub.substrate.rpc_request('author_unwatchExtrinsic', [subscription_id])
                    return {
                        'block_hash': message_result['finalized'],
                        'extrinsic_hash': '0x{}'.format(transfer['extrinsic_data'].hex()),
                        'finalized': True
                    }
                elif 'inblock' in message_result and wait_for_inclusion and not wait_for_finalization:
                    sub.substrate.rpc_request('author_unwatchExtrinsic', [subscription_id])
                    return {
                        'block_hash': message_result['inblock'],
                        'extrinsic_hash': '0x{}'.format(transfer['extrinsic_data'].hex()),
                        'finalized': False
                    }

        if wait_for_inclusion or wait_for_finalization:
            response = sub.substrate.rpc_request(
                "author_submitAndWatchExtrinsic",
                [transfer['extrinsic_data']],
                result_handler=result_handler
            )

            result = ExtrinsicReceipt(
                substrate=sub.substrate,
                extrinsic_hash=response['extrinsic_hash'],
                block_hash=response['block_hash'],
                finalized=response['finalized']
            )
            
        else:
            response = sub.substrate.rpc_request(
                "author_submitExtrinsic", 
                [transfer['extrinsic_data']]
            )

            if 'result' not in response:
                raise SubstrateRequestException(response.get('error'))

            result = sub.substrate.ExtrinsicReceipt(
                substrate=sub.substrate,
                extrinsic_hash=response['result']
            )

        # process if registration successful, try again if pow is still valid
        response.process_events()
        was_successful = response.is_success
        if not was_successful:
            logger.info(f'{user_UID} Transfer to failed.')
        else:
            logger.info(f'{user_UID} Transfer successful.')
        
        # Update the specific transfer in the database with a new field with attempted=True
        if user_UID in database:
            for prev_transfer in database[user_UID]:
                if transfer['extrinsic_data'] == prev_transfer['extrinsic_data']:
                    prev_transfer.update({'attempted': True, 'was_successful': was_successful})
                    break
        
       


