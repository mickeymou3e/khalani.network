import torch
from simlearn.utils.data import SoccerDataset, get_data_loaders
import glob
import os
from pathlib import Path

def test_data_loading():
    # Get data directory from config
    data_dir = 'data'
    
    # Find all parquet files
    data_files = glob.glob(str(Path(data_dir) / "*.parquet"))
    print(f"\nFound {len(data_files)} parquet files:")
    for file in data_files:
        print(f"- {file}")
    
    if not data_files:
        raise RuntimeError(f"No parquet files found in {data_dir}")
    
    # Test loading a single file
    print("\nTesting single file loading:")
    dataset = SoccerDataset(data_files[0])
    print(f"Number of samples: {len(dataset)}")
    print(f"Feature shape: {dataset.X.shape}")
    print(f"Target shape: {dataset.y.shape}")
    
    # Test data loader
    print("\nTesting data loader:")
    loader = get_data_loaders(data_files, batch_size=32)
    
    # Get a single batch
    batch = next(iter(loader))
    print(f"Batch features shape: {batch['features'].shape}")
    print(f"Batch target shape: {batch['target'].shape}")
    
    # Print unique target values to verify they're ±1
    unique_targets = torch.unique(batch['target'])
    print(f"\nUnique target values: {unique_targets}")
    
    # Print feature statistics
    print("\nFeature statistics:")
    print(f"Mean: {batch['features'].mean():.3f}")
    print(f"Std: {batch['features'].std():.3f}")
    print(f"Min: {batch['features'].min():.3f}")
    print(f"Max: {batch['features'].max():.3f}")

if __name__ == "__main__":
    test_data_loading() 