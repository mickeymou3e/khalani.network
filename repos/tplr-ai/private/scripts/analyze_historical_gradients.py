#!/usr/bin/env python3
# The MIT License (MIT)
# © 2024 templar.tech

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import io

# Find and load the correct .env file BEFORE any other imports
def load_env():
    possible_paths = [
        Path(__file__).parent.parent / ".env",
        Path(__file__).parent.parent / "docker" / ".env",
        Path.cwd() / ".env",
        Path.cwd() / "docker" / ".env",
    ]
    
    for env_path in possible_paths:
        if env_path.exists():
            print(f"Loading environment from: {env_path}")
            load_dotenv(env_path, override=True)
            return True
            
    print("Error: No .env file found in any of these locations:")
    for path in possible_paths:
        print(f"- {path}")
    return False

if not load_env():
    sys.exit(1)

# Verify environment variables before imports
required_vars = [
    'R2_GRADIENTS_ACCOUNT_ID',
    'R2_GRADIENTS_BUCKET_NAME',
    'R2_GRADIENTS_READ_ACCESS_KEY_ID',
    'R2_GRADIENTS_READ_SECRET_ACCESS_KEY',
    'R2_GRADIENTS_WRITE_ACCESS_KEY_ID',
    'R2_GRADIENTS_WRITE_SECRET_ACCESS_KEY',
    'R2_DATASET_BUCKET_NAME'
]

missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    print("Missing required environment variables:")
    for var in missing_vars:
        print(f"- {var}")
    sys.exit(1)

# Only import other dependencies after environment is loaded
import asyncio
import argparse
import numpy as np
import torch
import boto3
from botocore.config import Config
import json
from datetime import datetime
import pandas as pd
from typing import Dict, List, Tuple
import tplr
from transformers import LlamaForCausalLM

class GradientAnalyzer:
    def __init__(self, start_step: int = 0, end_step: int = 63, device: str = "cuda"):
        self.start_step = start_step
        self.end_step = end_step
        self.device = device
        self.config = self.setup_config()
        self.setup_r2_client()
        self.setup_model()
        
    @staticmethod
    def setup_config():
        parser = argparse.ArgumentParser(description="Historical Gradient Analysis")
        parser.add_argument("--device", type=str, default="cuda")
        parser.add_argument("--start_step", type=int, default=0)
        parser.add_argument("--end_step", type=int, default=63)
        parser.add_argument("--anomaly_threshold", type=float, default=2.0)
        config = parser.parse_args()
        
        # Print loaded environment variables for debugging
        print("\nEnvironment Variables:")
        for key in os.environ:
            if key.startswith('R2_'):
                print(f"{key}: {os.getenv(key)}")
        
        return config

    def setup_r2_client(self):
        """Initialize R2 client with credentials from env"""
        self.s3_client = boto3.client(
            's3',
            endpoint_url=f"https://{os.getenv('R2_GRADIENTS_ACCOUNT_ID')}.r2.cloudflarestorage.com",
            aws_access_key_id=os.getenv('R2_GRADIENTS_READ_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('R2_GRADIENTS_READ_SECRET_ACCESS_KEY'),
            config=Config(
                retries = dict(
                    mode = 'standard'
                )
            )
        )
        self.bucket_name = os.getenv('R2_GRADIENTS_BUCKET_NAME')

    def setup_model(self):
        """Initialize model and compression components"""
        print("\nInitializing model and compression components...")
        self.hparams = tplr.load_hparams()
        self.model = LlamaForCausalLM(self.hparams.model_config)
        self.model.to(self.device)
        
        self.transformer = tplr.compress.TransformDCT(
            self.model,
            target_chunk=self.hparams.target_chunk,
        )
        self.compressor = tplr.compress.CompressDCT()

        # Initialize shapes for each parameter
        self.xshapes = {}
        self.totalks = {}
        for n, p in self.model.named_parameters():
            transformed = self.transformer.encode(p)
            self.xshapes[n] = transformed.shape
            self.totalks[n] = transformed.numel()
        print("Model setup complete")

    async def analyze_gradients(self):
        """Analyze gradients between specified global steps"""
        print(f"\nAnalyzing gradients from step {self.start_step} to {self.end_step}")
        gradient_data = []
        anomalies = []
        
        # List objects in the bucket
        prefix = f"gathers/{tplr.__version__}/"
        print(f"Searching for gradients with prefix: {prefix}")
        
        try:
            paginator = self.s3_client.get_paginator('list_objects_v2')
            
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                if 'Contents' not in page:
                    continue
                    
                for obj in page['Contents']:
                    key = obj['Key']
                    # Key format: gathers/version/uid/window/global_step.npz
                    parts = key.split('/')
                    if len(parts) != 5:  # Ensure we have all parts
                        continue
                        
                    try:
                        _, version, uid, window, step_file = parts
                        global_step = int(step_file.split('.')[0])  # Remove .npz
                        
                        if self.start_step <= global_step <= self.end_step:
                            print(f"Processing: UID {uid}, Window {window}, Step {global_step}")
                            
                            # Download and analyze gradient
                            response = self.s3_client.get_object(
                                Bucket=self.bucket_name,
                                Key=key
                            )
                            
                            # Load the NPZ file from memory
                            with io.BytesIO(response['Body'].read()) as bio:
                                data = np.load(bio, allow_pickle=True)
                                gradient_info = {
                                    'uid': uid,
                                    'window': int(window),
                                    'global_step': global_step,
                                    'key': key
                                }
                                
                                # Analyze gradient statistics
                                state_dict = data['state_dict'].item()
                                for param_name, param_data in state_dict.items():
                                    if param_name.endswith('vals'):
                                        grad_tensor = torch.from_numpy(param_data).to(self.device)
                                        gradient_info.update({
                                            'grad_norm': float(torch.norm(grad_tensor).cpu()),
                                            'grad_mean': float(torch.mean(grad_tensor).cpu()),
                                            'grad_std': float(torch.std(grad_tensor).cpu()),
                                            'grad_sparsity': float((grad_tensor == 0).float().mean().cpu())
                                        })
                                        break  # Only analyze the first gradient tensor
                                
                                gradient_data.append(gradient_info)
                                
                                # Check for anomalies
                                if self.detect_anomalies(gradient_info):
                                    anomalies.append(gradient_info)
                            
                    except Exception as e:
                        print(f"Error processing {key}: {e}")
                        continue

            # Create summary report
            self.create_summary_report(gradient_data, anomalies)
            
        except Exception as e:
            print(f"Failed to list objects: {str(e)}")
            raise

    def detect_anomalies(self, grad_info: Dict) -> bool:
        """Detect anomalies in gradient statistics"""
        # Define thresholds for anomaly detection
        THRESHOLDS = {
            'grad_norm': (1e-6, 1e3),  # Min and max acceptable gradient norm
            'grad_std': (1e-6, 1e2),   # Min and max acceptable standard deviation
            'grad_sparsity': (0.1, 0.9) # Min and max acceptable sparsity
        }
        
        anomalies = []
        for metric, (min_val, max_val) in THRESHOLDS.items():
            if metric in grad_info:
                value = grad_info[metric]
                if value < min_val or value > max_val:
                    anomalies.append(f"{metric}: {value}")
        
        if anomalies:
            grad_info['anomalies'] = anomalies
            return True
        return False

    def create_summary_report(self, gradient_data: List[Dict], anomalies: List[Dict]):
        """Create and save analysis summary"""
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame(gradient_data)
        
        # Generate summary statistics
        summary = {
            "total_gradients": len(gradient_data),
            "unique_uids": len(df["uid"].unique()),
            "total_anomalies": len(anomalies),
            "steps_analyzed": f"{self.start_step} to {self.end_step}",
            "timestamp": datetime.now().isoformat(),
        }

        # Add basic statistics for each metric
        for metric in ["grad_norm", "grad_mean", "grad_std", "grad_sparsity"]:
            if metric in df.columns:
                summary[f"{metric}_mean"] = float(df[metric].mean())
                summary[f"{metric}_std"] = float(df[metric].std())

        # Save detailed reports
        output_dir = Path("analysis_reports")
        output_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save summary
        with open(output_dir / f"summary_{timestamp}.json", "w") as f:
            json.dump(summary, f, indent=2)
            
        # Save anomalies
        if anomalies:
            with open(output_dir / f"anomalies_{timestamp}.json", "w") as f:
                json.dump(anomalies, f, indent=2)
            
        # Save full gradient data
        df.to_csv(output_dir / f"gradient_data_{timestamp}.csv", index=False)
        
        # Print summary to console
        print("\n=== Analysis Summary ===")
        print(json.dumps(summary, indent=2))
        
        if anomalies:
            print("\n=== Detected Anomalies ===")
            for anomaly in anomalies:
                print(f"\nUID: {anomaly['uid']}, Step: {anomaly['global_step']}")
                print(f"Anomalous metrics: {anomaly['anomalies']}")
                print(f"File: {anomaly['key']}")

def main():
    try:
        analyzer = GradientAnalyzer(start_step=20, end_step=63)
        asyncio.run(analyzer.analyze_gradients())
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()