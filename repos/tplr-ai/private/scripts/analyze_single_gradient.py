#!/usr/bin/env python3
# The MIT License (MIT)
# © 2024 templar.tech

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load env before imports
def load_env():
    env_path = Path(__file__).parent.parent / ".env"
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        sys.exit(1)
    load_dotenv(env_path, override=True)

load_env()

import io
import asyncio
import argparse
import numpy as np
import torch
import boto3
import aioboto3
from botocore.config import Config
import json
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple
from concurrent.futures import ProcessPoolExecutor
from functools import partial
import tqdm
import tplr

class UIDGradientAnalyzer:
    def __init__(self, uid: int, device: str = "cuda", batch_size: int = 50, max_workers: int = 8):
        self.uid = str(uid)
        self.device = device
        self.batch_size = batch_size
        self.max_workers = max_workers
        print(f"\nInitializing analysis for UID: {uid}")
        self.setup_clients()
        
    def setup_clients(self):
        """Initialize S3 clients"""
        self.session = aioboto3.Session()
        self.endpoint_url = f"https://{os.getenv('R2_GRADIENTS_ACCOUNT_ID')}.r2.cloudflarestorage.com"
        self.aws_access_key_id = os.getenv('R2_GRADIENTS_READ_ACCESS_KEY_ID')
        self.aws_secret_access_key = os.getenv('R2_GRADIENTS_READ_SECRET_ACCESS_KEY')
        self.bucket_name = os.getenv('R2_GRADIENTS_BUCKET_NAME')

    async def get_gradient_keys(self) -> List[str]:
        """Get all gradient keys for the UID"""
        prefix = f"gathers/{tplr.__version__}/{self.uid}/"
        keys = []
        
        async with self.session.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        ) as client:
            paginator = client.get_paginator('list_objects_v2')
            async for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                if 'Contents' in page:
                    keys.extend(obj['Key'] for obj in page['Contents'])
        
        return sorted(keys)

    @staticmethod
    def process_gradient(data_tuple: Tuple[bytes, str, str]) -> Dict:
        """Process a single gradient file"""
        gradient_data, key, device = data_tuple  # Unpack the tuple directly
        parts = key.split('/')
        _, version, uid, window, step_file = parts
        global_step = int(step_file.split('.')[0])
        
        with io.BytesIO(gradient_data) as bio:
            data = np.load(bio, allow_pickle=True)
            grad_info = {
                'window': int(window),
                'global_step': global_step,
                'key': key
            }
            
            state_dict = data['state_dict'].item()
            layer_stats = {}
            
            for param_name, param_data in state_dict.items():
                if param_name.endswith('vals'):
                    base_name = param_name[:-4]
                    grad_tensor = torch.from_numpy(param_data).to(device)
                    
                    layer_stats[base_name] = {
                        'norm': float(torch.norm(grad_tensor).cpu()),
                        'mean': float(torch.mean(grad_tensor).cpu()),
                        'std': float(torch.std(grad_tensor).cpu()),
                        'sparsity': float((grad_tensor == 0).float().mean().cpu()),
                        'min': float(torch.min(grad_tensor).cpu()),
                        'max': float(torch.max(grad_tensor).cpu())
                    }
            
            grad_info['layer_stats'] = layer_stats
            return grad_info

    async def download_batch(self, keys: List[str]) -> List[bytes]:
        """Download a batch of gradients concurrently"""
        async with self.session.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        ) as client:
            tasks = []
            for key in keys:
                tasks.append(self.download_single(client, key))
            return await asyncio.gather(*tasks)

    async def download_single(self, client, key: str) -> Tuple[bytes, str]:
        """Download a single gradient file"""
        response = await client.get_object(Bucket=self.bucket_name, Key=key)
        async with response['Body'] as stream:
            data = await stream.read()
            return data, key

    async def analyze(self):
        """Analyze all gradients from the specified UID"""
        print("Getting list of gradient files...")
        keys = await self.get_gradient_keys()
        total_files = len(keys)
        print(f"Found {total_files} gradient files")

        gradient_data = []
        
        # Process in batches
        with ProcessPoolExecutor(max_workers=self.max_workers) as executor:
            for i in range(0, len(keys), self.batch_size):
                batch_keys = keys[i:i + self.batch_size]
                print(f"\nProcessing batch {i//self.batch_size + 1}/{(total_files + self.batch_size - 1)//self.batch_size}")
                
                # Download batch
                batch_data = await self.download_batch(batch_keys)
                
                # Process batch in parallel - removed partial and pass tuples directly
                batch_results = list(executor.map(
                    self.process_gradient,
                    [(data, key, self.device) for data, key in batch_data]
                ))
                
                gradient_data.extend(batch_results)
                
                print(f"Processed {len(gradient_data)}/{total_files} gradients")

        # Generate analysis
        windows_seen = {d['window'] for d in gradient_data}
        steps_seen = {d['global_step'] for d in gradient_data}
        self.generate_report(gradient_data, windows_seen, steps_seen)

    def generate_report(self, gradient_data: List[Dict], windows_seen: set, steps_seen: set):
        """Generate comprehensive analysis report and visualizations"""
        if not gradient_data:
            print("No gradient data found to analyze!")
            return
            
        # Sort data by global step
        gradient_data.sort(key=lambda x: x['global_step'])
        
        # Basic statistics
        print("\n=== Analysis Summary ===")
        print(f"Total windows analyzed: {len(windows_seen)}")
        print(f"Total steps analyzed: {len(steps_seen)}")
        print(f"Total gradients processed: {len(gradient_data)}")
        print(f"Step range: {min(steps_seen)} to {max(steps_seen)}")
        
        # Create visualizations directory
        viz_dir = Path('gradient_analysis')
        viz_dir.mkdir(exist_ok=True)
        
        # Create figure with adjusted size and margins
        plt.figure(figsize=(20, 10))  # Increased width
        
        # Extract and plot statistics for each layer
        for grad_info in gradient_data[0]['layer_stats'].keys():
            norms = [d['layer_stats'][grad_info]['norm'] for d in gradient_data]
            steps = [d['global_step'] for d in gradient_data]
            
            plt.plot(steps, norms, label=f'{grad_info}')
        
        plt.title(f'Gradient Norms Over Time - UID {self.uid}')
        plt.xlabel('Global Step')
        plt.ylabel('Gradient Norm')
        
        # Adjust legend position and layout
        plt.legend(bbox_to_anchor=(1.04, 1), 
                  loc='upper left', 
                  borderaxespad=0,
                  bbox_transform=plt.gca().transAxes)
        
        # Add padding to prevent cutoff
        plt.subplots_adjust(right=0.85)  # Adjust right margin for legend
        
        plt.savefig(viz_dir / f'uid_{self.uid}_gradient_norms.png', 
                    bbox_inches='tight', 
                    dpi=300,
                    pad_inches=0.5)  # Add padding around the plot
        plt.close()
        
        # Generate detailed statistics report
        report = {
            'uid': self.uid,
            'total_windows': len(windows_seen),
            'total_steps': len(steps_seen),
            'total_gradients': len(gradient_data),
            'windows': sorted(list(windows_seen)),
            'step_range': [min(steps_seen), max(steps_seen)],
            'statistics_per_window': {}
        }
        
        # Add per-window statistics
        for window in windows_seen:
            window_grads = [g for g in gradient_data if g['window'] == window]
            window_stats = {
                'total_gradients': len(window_grads),
                'global_steps': [g['global_step'] for g in window_grads],
                'layer_stats': {}
            }
            
            # Compute average stats per layer for this window
            for layer in gradient_data[0]['layer_stats'].keys():
                layer_stats = {
                    'avg_norm': np.mean([g['layer_stats'][layer]['norm'] for g in window_grads]),
                    'avg_sparsity': np.mean([g['layer_stats'][layer]['sparsity'] for g in window_grads]),
                    'avg_std': np.mean([g['layer_stats'][layer]['std'] for g in window_grads]),
                    'max_norm': max([g['layer_stats'][layer]['norm'] for g in window_grads]),
                    'min_norm': min([g['layer_stats'][layer]['norm'] for g in window_grads])
                }
                window_stats['layer_stats'][layer] = layer_stats
            
            report['statistics_per_window'][str(window)] = window_stats

        # Save report
        with open(viz_dir / f'uid_{self.uid}_analysis.json', 'w') as f:
            json.dump(report, f, indent=2, default=float)  # Added default=float for numpy types
        
        print(f"\nAnalysis complete! Reports saved in {viz_dir}")

def main():
    parser = argparse.ArgumentParser(description="Analyze gradients for a specific UID")
    parser.add_argument("uid", type=int, help="UID to analyze")
    parser.add_argument("--device", type=str, default="cuda", help="Device to use for computations")
    parser.add_argument("--batch-size", type=int, default=50, help="Number of gradients to process in parallel")
    parser.add_argument("--max-workers", type=int, default=8, help="Maximum number of worker processes")
    args = parser.parse_args()
    
    try:
        analyzer = UIDGradientAnalyzer(
            args.uid, 
            args.device,
            batch_size=args.batch_size,
            max_workers=args.max_workers
        )
        asyncio.run(analyzer.analyze())
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()