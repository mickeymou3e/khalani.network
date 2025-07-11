import argparse
import torch
import torch.nn as nn
import torch.optim as optim
import yaml
from pathlib import Path
import glob
import os

from simlearn.utils.lr_finder import LRFinder
from simlearn.approaches.models.full import FullModel
from simlearn.approaches.models.simple import BallOnlyModel
from simlearn.utils.data import get_data_loaders

def main():
    parser = argparse.ArgumentParser(description='Find optimal learning rate')
    parser.add_argument('--config', type=str, required=True,
                        help='Path to config file')
    args = parser.parse_args()

    # Load config
    with open(args.config) as f:
        config = yaml.safe_load(f)

    # Setup device
    device = (
        torch.device("mps") if torch.backends.mps.is_available()
        else torch.device("cuda") if torch.cuda.is_available()
        else torch.device("cpu")
    )

    # Create model
    model_type = config['model']['type']
    model = FullModel() if model_type == 'full' else BallOnlyModel()
    model = model.to(device)

    # Setup training
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-7)  # Start with very small lr

    # Get data directory from config and find all parquet files
    data_dir = config['data']['data_dir']
    data_files = glob.glob(str(Path(data_dir) / "*.parquet"))
    if not data_files:
        raise RuntimeError(f"No parquet files found in {data_dir}")

    # Get data loader
    train_loader = get_data_loaders(
        data_files,
        batch_size=config['training']['batch_size']
    )

    # Prepare output directory and plot path
    batch_size = config['training']['batch_size']
    output_dir = f"outputs/{model_type}/lr_finder"
    os.makedirs(output_dir, exist_ok=True)
    plot_path = f"{output_dir}/lr_finder_bs{batch_size}.png"

    # Create LR finder
    lr_finder = LRFinder(model, optimizer, criterion, device)

    # Run the learning rate finder
    history = lr_finder.find(
        train_loader,
        start_lr=1e-7,
        end_lr=1,
        num_iter=100
    )

    # Plot results and get suggested learning rates
    suggested_lr, conservative_lr = lr_finder.plot(save_path=plot_path)

    print(f"\nLearning rate suggestions:")
    print(f"Aggressive LR:    {suggested_lr:.2e}")
    print(f"Conservative LR:  {conservative_lr:.2e}")
    print(f"\nPlot saved to {plot_path}")

if __name__ == '__main__':
    main() 