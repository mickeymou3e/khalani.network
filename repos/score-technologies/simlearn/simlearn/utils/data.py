import torch
from torch.utils.data import Dataset, DataLoader, ConcatDataset
import pandas as pd
import numpy as np
from simlearn.utils.preprocessing import SoccerScaler

class SoccerDataset(Dataset):
    def __init__(self, data_file, transform=None):
        """
        Args:
            data_file (str): Path to the parquet file
            transform (callable, optional): Optional transform to be applied on a sample
        """
        # Read parquet file
        self.data = pd.read_parquet(data_file)
        
        # Define expected columns
        expected_columns = [
            'ball_x', 'ball_y', 'ball_vx', 'ball_vy',
            'team1_0_x', 'team1_0_y', 'team1_1_x', 'team1_1_y',
            'team1_2_x', 'team1_2_y', 'team1_3_x', 'team1_3_y',
            'team1_4_x', 'team1_4_y', 'team2_0_x', 'team2_0_y',
            'team2_1_x', 'team2_1_y', 'team2_2_x', 'team2_2_y',
            'team2_3_x', 'team2_3_y', 'team2_4_x', 'team2_4_y',
            'outcome'
        ]
        
        # Verify all expected columns exist
        missing_columns = [col for col in expected_columns if col not in self.data.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Select only the expected columns
        self.data = self.data[expected_columns]
        
        self.transform = transform
        self.scaler = SoccerScaler()
        
        # Split features and target
        self.features = self.data.drop('outcome', axis=1)
        self.targets = self.data['outcome']
        
        # Convert to tensors and scale
        self.X = torch.FloatTensor(self.features.values)
        self.X = self.scaler.scale_features(self.X)
        
        # Ensure targets are exactly ±1
        self.y = torch.sign(torch.FloatTensor(self.targets.values))  # This will convert to exactly ±1
        
        # Verify target distribution
        unique_values = torch.unique(self.y)
        if not torch.allclose(torch.abs(unique_values), torch.tensor([1.0])):
            raise ValueError(f"Targets should be ±1, found values: {unique_values}")

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()
            
        sample = {
            'features': self.X[idx],
            'target': self.y[idx]
        }
        
        if self.transform:
            sample = self.transform(sample)
            
        return sample

def get_data_loaders(data_files, batch_size=32):
    """Create data loaders from a list of files."""
    datasets = []
    for file in data_files:
        try:
            dataset = SoccerDataset(file)
            datasets.append(dataset)
        except Exception as e:
            print(f"Error loading {file}: {e}")
    
    if not datasets:
        raise RuntimeError("No valid datasets found")
    
    # Combine all datasets
    combined_dataset = ConcatDataset(datasets)
    
    # Create data loader
    data_loader = DataLoader(
        combined_dataset, 
        batch_size=batch_size,
        shuffle=True,  # Only shuffle if it's training data
        num_workers=4
    )
    
    return data_loader

def load_dataset(file_path):
    """Load a single dataset file with error handling."""
    try:
        dataset = SoccerDataset(file_path)
        if len(dataset) > 0:
            return dataset
        else:
            print(f"Warning: {file_path} is empty")
            return None
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None 