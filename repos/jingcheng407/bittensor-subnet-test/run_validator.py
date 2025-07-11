from _sdk.neurons.validator import Validator
import bittensor as bt
import time

if __name__ == "__main__":
    with Validator() as validator:
        while True:
            bt.logging.info(f"Validator running... {time.time()}")
            time.sleep(60 * 10)
