import pytest
import torch
import pandas as pd
import tempfile
import os
from simlearn.utils.data import SoccerDataset, get_data_loaders

@pytest.fixture
def sample_csv():
    # Create a temporary CSV file with sample data with all required columns
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv') as f:
        # Write header
        headers = ['ball_x', 'ball_y', 'ball_vx', 'ball_vy']
        # Add team1 players
        for i in range(5):
            headers.extend([f'team1_{i}_x', f'team1_{i}_y'])
        # Add team2 players
        for i in range(5):
            headers.extend([f'team2_{i}_x', f'team2_{i}_y'])
        headers.append('outcome')
        
        f.write(','.join(headers) + '\n')
        
        # Write 10 sample rows
        for i in range(10):
            # Ball data
            row = [50.0, 30.0, 0.0, 0.0]
            # Team 1 data
            for j in range(5):
                row.extend([20.0 + j*10, 30.0])
            # Team 2 data
            for j in range(5):
                row.extend([80.0 - j*10, 30.0])
            # Outcome
            row.append(1 if i < 5 else -1)
            
            f.write(','.join(map(str, row)) + '\n')
        return f.name

def test_soccer_dataset(sample_csv):
    dataset = SoccerDataset(sample_csv)
    
    # Test dataset length
    assert len(dataset) == 10
    
    # Test single item retrieval
    sample = dataset[0]
    assert 'features' in sample
    assert 'target' in sample
    assert isinstance(sample['features'], torch.Tensor)
    assert isinstance(sample['target'], torch.Tensor)
    
    # Test features shape (24 input features)
    assert sample['features'].shape == torch.Size([24])
    
    # Test target shape (single value)
    assert sample['target'].shape == torch.Size([])

def test_data_loaders(sample_csv):
    train_loader, val_loader, test_loader = get_data_loaders(
        sample_csv,
        batch_size=2,
        train_split=0.6,
        val_split=0.2
    )
    
    # Calculate expected sizes
    total_samples = 10
    expected_train = 6  # 60% of 10
    expected_val = 2   # 20% of 10
    expected_test = 2  # remaining 20%
    
    # Count actual samples in each loader
    train_samples = sum(len(batch['features']) for batch in train_loader)
    val_samples = sum(len(batch['features']) for batch in val_loader)
    test_samples = sum(len(batch['features']) for batch in test_loader)
    
    # Test split sizes
    assert train_samples == expected_train
    assert val_samples == expected_val
    assert test_samples == expected_test
    
    # Test batch format
    for batch in train_loader:
        assert 'features' in batch
        assert 'target' in batch
        assert batch['features'].shape[1] == 24  # correct number of features
        break

def test_cleanup(sample_csv):
    # Cleanup temporary file
    os.unlink(sample_csv) 