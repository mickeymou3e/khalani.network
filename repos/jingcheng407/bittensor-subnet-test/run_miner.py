from _sdk.neurons.miner import Miner
import bittensor as bt
import time

if __name__ == "__main__":
    with Miner() as miner:
        while True:
            bt.logging.info(f"Miner running... {time.time()}")
            time.sleep(60)
