# The MIT License (MIT)
# © 2025 tplr.ai

# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the "Software"), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
# THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.


# Standard library
import sys
import time
import random
import asyncio
import argparse
import threading

# Third party
import torch
import numpy as np
import bittensor as bt
from torch.optim import SGD
from transformers import LlamaForCausalLM
from torch.optim.lr_scheduler import (
    CosineAnnealingWarmRestarts,
    LinearLR,
    SequentialLR,
)

# Local
import tplr


# GPU optimizations
torch.manual_seed(42)
torch.cuda.manual_seed_all(42)
np.random.seed(42)
random.seed(42)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False
torch.backends.cuda.matmul.allow_tf32 = True
torch.backends.cudnn.allow_tf32 = True


class Miner:
    # Command line config items.
    @staticmethod
    def config():
        parser = argparse.ArgumentParser(description="Miner script")
        parser.add_argument(
            "--netuid", type=int, default=268, help="Bittensor network UID."
        )
        parser.add_argument(
            "--project", type=str, default="templar", help="Wandb project."
        )
        parser.add_argument(
            "--device", type=str, default="cuda", help="Device to use for training"
        )
        parser.add_argument("--debug", action="store_true", help="Enable debug logging")
        parser.add_argument("--trace", action="store_true", help="Enable trace logging")
        parser.add_argument(
            "--store-gathers",
            action="store_true",
            help="Store gathered gradients in R2",
        )
        bt.subtensor.add_args(parser)
        bt.logging.add_args(parser)
        bt.wallet.add_args(parser)
        config = bt.config(parser)
        if config.debug:
            tplr.debug()
        if config.trace:
            tplr.trace()
        return config

    def __init__(self):
        tplr.logger.debug("Starting initialization...")

        # Init config and load hparams
        self.config = Miner.config()
        self.hparams = tplr.load_hparams()

        # Init bittensor objects
        self.wallet = bt.wallet(config=self.config)
        self.subtensor = bt.subtensor(config=self.config)
        self.metagraph = self.subtensor.metagraph(self.config.netuid)
        if self.wallet.hotkey.ss58_address not in self.metagraph.hotkeys:
            tplr.logger.error(
                f"\n\t[bold]The wallet {self.wallet} is not registered on subnet: {self.metagraph.netuid}[/bold]"
            )
            sys.exit()
        self.uid = self.metagraph.hotkeys.index(self.wallet.hotkey.ss58_address)

        # Init model with hparams config
        self.model = LlamaForCausalLM(self.hparams.model_config)
        self.model.to(self.config.device)
        self.tokenizer = self.hparams.tokenizer

        # Init compression
        self.transformer = tplr.compress.TransformDCT(
            self.model, target_chunk=self.hparams.target_chunk
        )
        self.compressor = tplr.compress.CompressDCT()

        # Init optimizer and momentum
        self.optimizer = SGD(self.model.parameters(), lr=self.hparams.learning_rate)
        self.momentum = {}
        self.xshapes = {}
        self.totalks = {}
        for n, p in self.model.named_parameters():
            self.momentum[n] = torch.zeros_like(p)
            _, _, xshape, totalk = self.compressor.compress(
                self.transformer.encode(self.momentum[n]), self.hparams.topk_compression
            )
            self.xshapes[n] = xshape
            self.totalks[n] = totalk
        # Set up scheduler
        warmup_scheduler = LinearLR(
            self.optimizer,
            start_factor=0.1,
            end_factor=1.0,
            total_iters=250,
        )
        cosine_scheduler = CosineAnnealingWarmRestarts(
            self.optimizer,
            T_0=10000,
            T_mult=2,
            eta_min=self.hparams.learning_rate * 0.1,
        )
        self.scheduler = SequentialLR(
            self.optimizer,
            schedulers=[warmup_scheduler, cosine_scheduler],
            milestones=[250],
        )

        # Init compression
        self.transformer = tplr.compress.TransformDCT(
            self.model,
            target_chunk=self.hparams.target_chunk,
        )
        self.compressor = tplr.compress.CompressDCT()

        # Init comms
        self.comms = tplr.comms.Comms(
            wallet=self.wallet,
            save_location="/tmp",
            key_prefix="model",
            config=self.config,
            netuid=self.config.netuid,
            metagraph=self.metagraph,
            hparams=self.hparams,
            uid=self.uid,
        )

        self.bucket = self.comms.get_own_bucket("gradients", "read")
        self.comms.try_commit(self.wallet, self.bucket)
        self.comms.fetch_commitments()

        # Init state params
        self.stop_event = asyncio.Event()
        self.current_block = self.subtensor.block
        self.current_window = int(self.current_block / self.hparams.blocks_per_window)
        self.start_window = self.current_window  # Record the start window
        self.global_step = 0  # Initialize global_step to zero
        self.comms.current_window = self.current_window
        self.step_counter = 0

        # Add step tracking
        self.window_step = 0
        # Initialize checkpoint monitoring tracking
        self.last_checkpoint_window = self.current_window
        # Add a lock to ensure checkpoint loads don't run concurrently.
        self.checkpoint_lock = asyncio.Lock()
        
        # Track additional metrics
        self.total_tokens_processed = 0
        self.batch_times = []  # For tracking processing speed

        # Initialize WandB
        # self.wandb = tplr.initialize_wandb(
        #     run_prefix='M',
        #     uid=self.uid,
        #     config=self.config,
        #     group='miner',
        #     job_type='mining'
        # )

    # Main training loop.
    async def run(self):
        # Start background block listener
        self.loop = asyncio.get_running_loop()
        self.listener = threading.Thread(
            target=self.block_listener,
            args=(self.loop,),
            daemon=True,
        )
        self.listener.start()  #
        # Load Peers
        if not self.config.peers:
            self.peers = self.comms.peers
            tplr.logger.info(f"Filtered gather peers with buckets: {self.peers}")
        else:
            self.peers = self.config.peers
        if self.uid not in self.peers:
            self.peers.append(self.uid)

        self.comms.commitments = self.comms.get_commitments_sync()
        self.comms.update_peers_with_buckets()
        tplr.logger.info("Loaded commitments")

        # Fetch start_window from highest stake validator
        self.start_window = await self.comms.get_start_window()
        tplr.logger.info(f"Using start_window: {self.start_window}")

        self.global_step = self.current_window - self.start_window
        tplr.logger.info(f"starting at Global Step : {self.global_step}")

        # Proceed to load checkpoint
        (
            success,
            loaded_momentum,
            loaded_global_step,
            loaded_optimizer,
            loaded_scheduler,
        ) = await self.comms.load_checkpoint(
            model=self.model,
            optimizer=self.optimizer,
            scheduler=self.scheduler,
            transformer=self.transformer,
            compressor=self.compressor,
            current_window=self.current_window,
            device=self.config.device,
            peers=self.peers,
            uid=self.uid,
            totalks=self.totalks,
        )
        if success:
            self.momentum = loaded_momentum
            self.global_step = loaded_global_step
            self.optimizer = loaded_optimizer
            self.scheduler = loaded_scheduler
            tplr.logger.info(
                f"Loaded checkpoint with global_step={self.global_step}, "
                f"optimizer_step={self.optimizer.state_dict()['state'].get(0, {}).get('step', 0)}, "
                f"scheduler_step={self.scheduler.last_epoch}"
            )
        else:
            tplr.logger.info("Starting from scratch")
            self.momentum = {
                n: torch.zeros_like(p) for n, p in self.model.named_parameters()
            }
            self.model.to(self.config.device)

        self.comms.start_commitment_fetcher()
        self.comms.start_background_tasks()
        asyncio.create_task(self.checkpoint_monitor())

        while True:
            # 1. Initialize window and update peers
            window_start = tplr.T()
            step_window = self.current_window
            self.global_step = (
                self.current_window - self.start_window
            )  # Update global_step
            tplr.logger.info(
                f"\n{'-' * 40} Window: {step_window} (Global Step: {self.global_step}) {'-' * 40}"
            )

            peer_start = tplr.T()
            self.comms.update_peers_with_buckets()
            self.peers = self.comms.peers
            tplr.logger.info(
                f"{tplr.P(step_window, tplr.T() - peer_start)} Updated peers - gather:{len(self.peers)}"
            )

            # 2. Load training data for this window
            data_start = tplr.T()
            pages = await tplr.r2_dataset.R2DatasetLoader.next_pages(
                offset=step_window,
                n_pages=self.hparams.pages_per_window,
                seed=self.uid,  # type: ignore
            )
            loader = await tplr.r2_dataset.R2DatasetLoader.create(
                batch_size=self.hparams.batch_size,
                sequence_length=self.hparams.sequence_length,
                pages_info=pages,
                tokenizer=self.tokenizer,
            )
            tplr.logger.info(
                f"{tplr.P(step_window, tplr.T() - data_start)} Loaded training data"
            )
            tplr.logger.info(
                f"Pages: {[p[1] for p in pages]} for  Window: {step_window}"
            )  # type: ignore

            # 3. Accumulate gradients over batches
            train_start = tplr.T()
            tplr.logger.info("Start accumulating...")
            self.optimizer.zero_grad()
            self.model.zero_grad()
            total_loss = 0
            batch_tokens = 0

            # Create the loader just once for this window
            loader = await tplr.r2_dataset.R2DatasetLoader.create(
                batch_size=self.hparams.batch_size,
                sequence_length=self.hparams.sequence_length,
                pages_info=pages,
                tokenizer=self.tokenizer
            )
            loader_iter = iter(loader)
            i = 0
            while self.current_window == step_window:
                try:
                    batch = next(loader_iter)
                except StopIteration:
                    # Reset the iterator if the loader is exhausted
                    loader_iter = iter(loader)
                    continue

                input_ids = torch.tensor(batch, dtype=torch.long).to(self.model.device)
                labels = input_ids.clone()
                labels = torch.where(labels == self.tokenizer.pad_token_id, -100, labels)

                with torch.amp.autocast(device_type=self.model.device.type, dtype=torch.bfloat16):
                    outputs = self.model(input_ids=input_ids, labels=labels)


                total_loss += outputs.loss.item()
                outputs.loss.backward()


                batch_tokens += (labels != -100).sum().item()
                tplr.logger.info(f'loss: {outputs.loss.item()}')
                i += 1

                if self.current_window != step_window:
                    tplr.logger.info("<Exhausted window>")
                    break
            tplr.logger.info(
                f"{tplr.P(step_window, tplr.T() - train_start)} Completed training"
            )

            compress_start = tplr.T()
            gradient, xshapes, totalks, _ = tplr.prepare_gradient_dict(
                self, pages, step_window
            )
            tplr.logger.info(
                f"{tplr.P(step_window, tplr.T() - compress_start)} Compressed local gradients"
            )
            tplr.logger.debug(f"Putting own state dict for UID {self.uid}")

            # Move everything to CPU before upload
            processed_state_dict = {}
            for k, v in gradient.items():
                if isinstance(v, torch.Tensor):
                    processed_state_dict[k] = v.to("cpu")
                else:
                    processed_state_dict[k] = v

            # Launch the put operation as a background task
            put_task = asyncio.create_task(
                self.comms.put(
                    state_dict=processed_state_dict,
                    uid=str(self.uid),
                    window=step_window,
                    key="gradient",
                    global_step=self.global_step,
                    local=False,
                    stale_retention=100,
                )
            )

            upload_size = sum(
                tensor.element_size() * tensor.nelement()
                for tensor in processed_state_dict.values()
                if isinstance(tensor, torch.Tensor)
            )
            tplr.logger.info(
                f"Uploading {upload_size} bytes of own state for UID: {self.uid}"
            )

            tplr.logger.info(
                f"Stopped accumulating: {i + 1} batches with {(i + 1) * self.hparams.batch_size * self.hparams.sequence_length} tokens"
            )

            # 5. Calculate and log metrics
            duration = time.time() - train_start
            self.batch_times.append(duration)
            self.total_tokens_processed += batch_tokens

            grad_norms = [
                p.grad.norm().item()
                for p in self.model.parameters()
                if p.grad is not None
            ]
            weight_norms = [p.norm().item() for p in self.model.parameters()]
            momentum_norms = [m.norm().item() for m in self.momentum.values()]
            # self.wandb.log({
            #     # Training metrics
            #     "miner/loss": total_loss/(i+1),
            #     "miner/tokens_per_sec": ((i+1) * self.hparams.batch_size * self.hparams.sequence_length)/duration,
            #     "miner/batch_duration": duration,
            #     "miner/total_tokens": self.total_tokens_processed,
            #     "miner/batch_tokens": batch_tokens,
            #     "miner/global_step": self.global_step,
                
            #     # Resource metrics
            #     "miner/gpu_memory_allocated": torch.cuda.memory_allocated() / 1024**2,  # MB
            #     "miner/gpu_memory_cached": torch.cuda.memory_reserved() / 1024**2,  # MB
                
            #     # Network metrics
            #     "miner/active_peers": len(self.peers),
            #     "miner/effective_batch_size": len(self.peers) * self.hparams.batch_size,
                
            #     # Optimization metrics
            #     "miner/learning_rate": self.scheduler.get_last_lr()[0],
                
            #     # Gradient statistics as points
            #     "miner/mean_grad_norm": sum(grad_norms) / len(grad_norms) if grad_norms else 0,
            #     "miner/max_grad_norm": max(grad_norms) if grad_norms else 0,
            #     "miner/min_grad_norm": min(grad_norms) if grad_norms else 0,
            #     "miner/grad_norm_std": torch.tensor(grad_norms).std().item() if grad_norms else 0,
            #     "miner/mean_weight_norm": sum(weight_norms) / len(weight_norms),
            #     "miner/mean_momentum_norm": sum(momentum_norms) / len(momentum_norms),
            # }, step=self.global_step)

            # 6. Prepare gradients for sharing using DeMo compression
            compress_start = tplr.T()
            gradient, xshapes, totalks, _ = tplr.prepare_gradient_dict(self, pages, step_window)
            tplr.logger.info(f'{tplr.P(step_window, tplr.T() - compress_start)} Compressed gradients')
            # 7. Gather and process peer gradients
            gather_start = tplr.T()
            gather_task = asyncio.create_task(
                self.comms.gather(
                    my_uid=self.uid,
                    uids=self.peers,
                    window=step_window,
                    key="gradient",
                    timeout=45,
                    device="cpu",
                    local=False,
                    stale_retention=100,
                    totalks=totalks,
                )
            )

            tplr.logger.info("Waiting on background tasks...")
            gather_result, _ = await asyncio.gather(gather_task, put_task)
            tplr.logger.info("Background tasks completed!")

            if gather_result is None:
                tplr.logger.error(
                    "Failed to gather gradients from peers. Waiting for next window."
                )
                while self.current_window == step_window:
                    await asyncio.sleep(0.1)
                continue

            # 8. Apply gathered gradients
            update_start = tplr.T()
            for n, p in self.model.named_parameters():
                idxs_key = n + "idxs"
                vals_key = n + "vals"
                idxs = getattr(gather_result.state_dict, idxs_key, None)
                vals = getattr(gather_result.state_dict, vals_key, None)
                if idxs is not None and vals is not None:
                    # Ensure idx and val are lists of tensors
                    if not isinstance(idxs, (list, tuple)):
                        idxs = [idxs]
                    if not isinstance(vals, (list, tuple)):
                        vals = [vals]

                    new_grad = self.transformer.decode(
                        self.compressor.batch_decompress(
                            p.to(self.config.device),
                            idxs,
                            vals,
                            xshapes[n],
                            totalks[n],
                        )
                    )
                    p.data.sub_(new_grad.sign(), alpha=self.scheduler.get_last_lr()[0])
                else:
                    tplr.logger.info(
                        f"Gradient data missing for parameter {n}, skipping."
                    )
            tplr.logger.info(
                f"{tplr.P(step_window, tplr.T() - update_start)} Updated model"
            )

            # 10. Optimization step
            tplr.logger.info("Finish and step.")
            self.optimizer.step()
            self.scheduler.step()

            # Log total window time and add timing metrics to existing wandb logging
            tplr.logger.info(f'{tplr.P(step_window, tplr.T() - window_start)} Completed window iteration')
            
            # self.wandb.log({
            #     # Add timing metrics
            #     "miner/timing/window_total": tplr.T() - window_start,
            #     "miner/timing/peer_update": tplr.T() - peer_start,
            #     "miner/timing/data_loading": tplr.T() - data_start,
            #     "miner/timing/training": tplr.T() - train_start,
            #     "miner/timing/compression": tplr.T() - compress_start,
            #     "miner/timing/gather": tplr.T() - gather_start,
            #     "miner/timing/model_update": tplr.T() - update_start,
            #     # Existing metrics
            #     "miner/loss": total_loss/(i+1),
            #     "miner/tokens_per_sec": ((i+1) * self.hparams.batch_size * self.hparams.sequence_length)/duration,
            #     "miner/total_tokens": self.total_tokens_processed,
            #     "miner/batch_tokens": batch_tokens,
            #     "miner/global_step": self.global_step,
            #     "miner/gpu_memory_allocated": torch.cuda.memory_allocated() / 1024**2,  # MB
            #     "miner/gpu_memory_cached": torch.cuda.memory_reserved() / 1024**2,  # MB
            #     "miner/active_peers": len(self.peers),
            #     "miner/effective_batch_size": len(self.peers) * self.hparams.batch_size,
            #     "miner/learning_rate": self.scheduler.get_last_lr()[0],
            #     "miner/mean_grad_norm": sum(grad_norms) / len(grad_norms) if grad_norms else 0,
            #     "miner/max_grad_norm": max(grad_norms) if grad_norms else 0,
            #     "miner/min_grad_norm": min(grad_norms) if grad_norms else 0,
            #     "miner/grad_norm_std": torch.tensor(grad_norms).std().item() if grad_norms else 0,
            #     "miner/mean_weight_norm": sum(weight_norms) / len(weight_norms),
            #     "miner/mean_momentum_norm": sum(momentum_norms) / len(momentum_norms),
            # }, step=self.global_step)

            self.global_step += 1
            self.window_step += 1
            tplr.logger.info(f"Total optimization steps: {self.global_step}")

            # Save checkpoint logic
            # if self.global_step % self.hparams.checkpoint_frequency == 0:
            #     tplr.logger.info(f"Creating checkpoint at global_step {self.global_step}")
                
            #     # asyncio checkpoint saving task
            #     asyncio.create_task(
            #         self.comms.save_checkpoint(
            #             model=self.model,
            #             optimizer=self.optimizer,
            #             scheduler=self.scheduler,
            #             momentum=self.momentum,
            #             global_step=self.global_step,
            #             current_window=self.current_window,
            #             start_window=self.start_window
            #         )
            #     )
            # else:
            #     tplr.logger.info("Skipping checkpoint save this round")

            # 4. Wait for next window
            tplr.logger.info("Wait for next window...")
            while self.current_window == step_window:
                await asyncio.sleep(0.1)

    # Listens for new blocks and sets self.current_block and self.current_window
    def block_listener(self, loop):
        def handler(event, _u, _s):
            self.current_block = int(event["header"]["number"])  # type: ignore
            new_window = int(self.current_block / self.hparams.blocks_per_window)
            if new_window != self.current_window:
                self.current_window = new_window
                self.comms.current_window = (
                    self.current_window
                )  # Synchronize comms current_window

        while not self.stop_event.is_set():
            try:
                bt.subtensor(config=self.config).substrate.subscribe_block_headers(
                    handler
                )
                break
            except Exception:
                time.sleep(1)

    async def checkpoint_monitor(self):
        """Background job: every 20 windows, check for a newer checkpoint and update state if found."""
        while not self.stop_event.is_set():
            if self.current_window % 50 == 0 and self.current_window > self.last_checkpoint_window:
                tplr.logger.info(f"Checkpoint monitor: checking at window {self.current_window}")
                async with self.checkpoint_lock:
                    try:
                        success, loaded_momentum, loaded_global_step, loaded_optimizer, loaded_scheduler = await self.comms.load_checkpoint(
                            model=self.model,
                            optimizer=self.optimizer,
                            scheduler=self.scheduler,
                            transformer=self.transformer,
                            compressor=self.compressor,
                            current_window=self.current_window,
                            device=self.config.device,
                            peers=self.peers,
                            uid=self.uid
                        )
                        if success and loaded_global_step > self.global_step:
                            tplr.logger.info(f"Checkpoint monitor: new checkpoint found with global_step {loaded_global_step}")
                            self.momentum = loaded_momentum
                            self.optimizer = loaded_optimizer
                            self.scheduler = loaded_scheduler
                        else:
                            tplr.logger.info("Checkpoint monitor: no newer checkpoint found.")
                    except Exception as e:
                        tplr.logger.error(f"Checkpoint monitor error: {e}")
                self.last_checkpoint_window = self.current_window
            await asyncio.sleep(5)

# Start miner/validator.
if __name__ == "__main__":
    asyncio.run(Miner().run())
