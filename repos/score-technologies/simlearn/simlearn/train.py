import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import ConcatDataset
import glob
import os
from tqdm import tqdm
import random
import numpy as np
import yaml
import argparse
from pathlib import Path
import matplotlib.pyplot as plt
from torch.optim.lr_scheduler import ReduceLROnPlateau
import time  # Add this at the top with other imports

from simlearn.utils.data import SoccerDataset, get_data_loaders
from simlearn.utils.symmetry import reflection_symmetry_1, reflection_symmetry_2
from simlearn.approaches.models.registry import ModelRegistry
from simlearn.visualize import create_field_plot

def set_seed(seed):
    """Set all random seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)

class SymmetryAugmentation:
    """Apply random symmetry transformations during training."""
    def __init__(self, p=0.5):
        self.p = p
    
    def __call__(self, batch):
        features, targets = batch['features'], batch['target']
        
        # Randomly apply reflection symmetry 1
        if random.random() < self.p:
            features = reflection_symmetry_1(features)
        
        # Randomly apply reflection symmetry 2
        if random.random() < self.p:
            features, targets = reflection_symmetry_2(features, targets)
        
        return {'features': features, 'target': targets}

def train_epoch(model, train_loader, criterion, optimizer, device):
    model.train()
    total_loss = 0
    all_outputs = []
    all_targets = []
    
    for batch_idx, batch in enumerate(tqdm(train_loader, desc="Training")):
        features = batch['features'].to(device)
        targets = batch['target'].to(device)
        
        optimizer.zero_grad()
        outputs = model(features)
        loss = criterion(outputs.squeeze(), targets)
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        all_outputs.extend(outputs.detach().cpu().numpy())
        all_targets.extend(targets.cpu().numpy())
        
        # Add a small break every 100 batches
        if batch_idx % 100 == 0:
            time.sleep(0.1)  # 100ms break
    
    avg_loss = total_loss / len(train_loader)
    all_outputs = np.array(all_outputs)
    all_targets = np.array(all_targets)
    
    stats = {
        'loss': avg_loss,
        'target_mean': np.mean(all_targets),
        'target_std': np.std(all_targets),
        'output_mean': np.mean(all_outputs),
        'output_std': np.std(all_outputs)
    }
    
    return avg_loss, stats

def validate(model, val_loader, criterion, device):
    model.eval()
    total_loss = 0
    num_samples = 0
    all_targets = []
    all_outputs = []
    batch_losses = []
    
    with torch.no_grad():
        for batch_idx, batch in enumerate(tqdm(val_loader, desc='Validation')):
            features = batch['features'].to(device)
            targets = batch['target'].to(device)
            batch_size = features.size(0)
            
            outputs = model(features)
            loss = criterion(outputs.squeeze(), targets)
            
            # Store all values for proper statistics
            all_targets.append(targets.cpu())
            all_outputs.append(outputs.squeeze().cpu())
            
            # Store batch loss
            batch_losses.append(loss.item())
            
            total_loss += loss.item() * batch_size
            num_samples += batch_size
            
            # Print detailed stats every 100 batches
            if batch_idx % 100 == 0:
                print(f"\nValidation Batch {batch_idx}")
                print(f"Loss: {loss.item():.6f}")
    
    # Compute proper statistics over all data
    all_targets = torch.cat(all_targets)
    all_outputs = torch.cat(all_outputs)
    
    stats = {
        'loss': np.mean(batch_losses),  # Average batch loss
        'target_mean': all_targets.mean().item(),
        'target_std': all_targets.std().item(),
        'output_mean': all_outputs.mean().item(),
        'output_std': all_outputs.std().item()
    }
    
    return total_loss / num_samples, stats

def split_files(data_files, train_split=0.8, val_split=0.1, seed=42):
    """Split files into train, validation, and test sets."""
    random.seed(seed)
    files = data_files.copy()
    random.shuffle(files)
    
    n_files = len(files)
    n_train = int(n_files * train_split)
    n_val = int(n_files * val_split)
    
    train_files = files[:n_train]
    val_files = files[n_train:n_train + n_val]
    test_files = files[n_train + n_val:]
    
    return train_files, val_files, test_files

def load_config(config_path):
    """Load configuration from YAML file."""
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config

def validate_config(config):
    """Validate configuration values and types."""
    required_types = {
        'training.seed': int,
        'training.batch_size': int,
        'training.learning_rate': float,
        'training.epochs': int,
        'training.train_split': float,
        'training.val_split': float,
    }
    
    for path, expected_type in required_types.items():
        keys = path.split('.')
        value = config
        for key in keys:
            value = value[key]
        
        if not isinstance(value, expected_type):
            try:
                # Try to convert the value to the expected type
                if expected_type == float:
                    config[keys[0]][keys[1]] = float(value)
                elif expected_type == int:
                    config[keys[0]][keys[1]] = int(value)
            except (ValueError, TypeError):
                raise TypeError(f"Config value for {path} must be {expected_type.__name__}, got {type(value).__name__}")

def create_loss_plot(train_losses, val_losses, lr_changes, save_path):
    """Create and save a plot of training and validation losses with LR change indicators.
    
    Args:
        train_losses (list): List of training losses
        val_losses (list): List of validation losses
        lr_changes (list): List of tuples (epoch, old_lr, new_lr)
        save_path (str): Where to save the plot
    """
    plt.figure(figsize=(12, 6))
    epochs = range(1, len(train_losses) + 1)
    
    # Plot losses
    plt.plot(epochs, train_losses, 'b-', label='Training Loss')
    plt.plot(epochs, val_losses, 'r-', label='Validation Loss')
    
    # Add vertical lines for learning rate changes
    for epoch, old_lr, new_lr in lr_changes:
        plt.axvline(x=epoch, color='g', linestyle='--', alpha=0.5)
        # Add annotation
        plt.text(epoch + 0.1, plt.ylim()[1], 
                f'LR: {old_lr:.1e} → {new_lr:.1e}',
                rotation=90, verticalalignment='top')
    
    plt.title('Training and Validation Loss\nwith Learning Rate Changes')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()  # Adjust layout to prevent text cutoff
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()

def print_target_stats(targets):
    """Print detailed statistics about target values."""
    unique, counts = torch.unique(targets, return_counts=True)
    total = counts.sum().item()
    print("\nTarget Value Distribution:")
    for val, count in zip(unique, counts):
        print(f"  {val:>5.1f}: {count:>6d} ({100.0 * count/total:>5.1f}%)")

def main():
    parser = argparse.ArgumentParser(description='Train soccer prediction model')
    parser.add_argument('--config', type=str, required=True,
                      help='Path to config file')
    args = parser.parse_args()
    
    # Load and validate configuration
    config = load_config(args.config)
    validate_config(config)
    
    # Setup device
    device = (
        torch.device("mps") if torch.backends.mps.is_available()
        else torch.device("cuda") if torch.cuda.is_available()
        else torch.device("cpu")
    )
    
    # Set random seed
    set_seed(config['training']['seed'])
    
    # Create output directories
    model_dir = Path(config['output']['base_dir']) / config['model']['type']
    plots_dir = model_dir / 'training_evolution'
    plots_dir.mkdir(parents=True, exist_ok=True)
    
    # Check for resume checkpoint
    resume_path = model_dir / 'model_resume.pt'
    start_epoch = 0
    train_losses = []
    val_losses = []
    best_val_loss = float('inf')
    
    # Create model using registry
    model = ModelRegistry.get_model(
        config['model']['type'],
        grid_size=config['model']['grid_size'],
        initial_sigma_player=config['model']['initial_sigma_player'],
        initial_sigma_ball=config['model']['initial_sigma_ball'],
        initial_delta_t=config['model']['initial_delta_t'],
        initial_friction=config['model']['initial_friction'],
        goal_importance_sigma=config['model']['goal_importance_sigma']
    )
    model = model.to(device)
    
    # Setup training
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=config['training']['learning_rate'])
    
    # Add learning rate scheduler with explicit type conversion for safety
    scheduler = ReduceLROnPlateau(
        optimizer, 
        mode='min',
        factor=float(config['training']['scheduler'].get('factor', 0.5)),
        patience=int(config['training']['scheduler'].get('patience', 10)),
        min_lr=float(config['training']['scheduler'].get('min_lr', 1e-6))
    )

    if resume_path.exists():
        print(f"\nResuming from checkpoint: {resume_path}")
        checkpoint = torch.load(resume_path, map_location=device, weights_only=False)
        
        # Load model
        model = checkpoint['model'].to(device)
        
        # Load optimizer state
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
        # Load scheduler state with patch for type safety
        if 'scheduler_state_dict' in checkpoint:
            sched_state = checkpoint['scheduler_state_dict']
            # Patch min_lrs to float if needed
            if 'min_lrs' in sched_state:
                sched_state['min_lrs'] = [float(x) for x in sched_state['min_lrs']]
            # Patch factor to float if needed
            if 'factor' in sched_state and isinstance(sched_state['factor'], str):
                sched_state['factor'] = float(sched_state['factor'])
            scheduler.load_state_dict(sched_state)
        
        # Resume training state
        start_epoch = checkpoint['epoch'] + 1
        train_losses = checkpoint['train_losses']
        val_losses = checkpoint['val_losses']
        best_val_loss = checkpoint['best_val_loss']
        
        print(f"Resuming from epoch {start_epoch}")
        print(f"Best validation loss so far: {best_val_loss:.6f}")
        print(f"Current learning rate: {optimizer.param_groups[0]['lr']}")
    
    # Load and split data files
    data_files = glob.glob(os.path.join(config['data']['data_dir'], '*.parquet'))
    print(f"Found {len(data_files)} data files")
    
    train_files, val_files, test_files = split_files(
        data_files, 
        train_split=config['training']['train_split'],
        val_split=config['training']['val_split'],
        seed=config['training']['seed']
    )
    
    # Create data loaders
    train_loader = get_data_loaders(
        train_files,
        batch_size=config['training']['batch_size']
    )
    
    val_loader = get_data_loaders(
        val_files,
        batch_size=config['training']['batch_size']
    )

    test_loader = get_data_loaders(
        test_files,
        batch_size=config['training']['batch_size']
    )
    
    print(f"\nDataset sizes:")
    print(f"Training samples: {len(train_loader.dataset)}")
    print(f"Validation samples: {len(val_loader.dataset)}")
    print(f"Test samples: {len(test_loader.dataset)}")
    
    # Initialize list to track learning rate changes
    lr_changes = []
    
    # Training loop
    for epoch in range(start_epoch, config['training']['epochs']):
        print("\n" + "="*40)
        print(f"Starting Epoch {epoch+1} / {config['training']['epochs']}")
        print("="*40)
        
        train_loss, train_stats = train_epoch(
            model, train_loader, criterion, optimizer, device
        )
        
        val_loss, val_stats = validate(model, val_loader, criterion, device)
        
        # Store losses
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        
        # Store current learning rate to detect changes
        old_lr = optimizer.param_groups[0]['lr']
        
        # Step the scheduler
        scheduler.step(val_loss)
        
        # Check if learning rate changed
        new_lr = optimizer.param_groups[0]['lr']
        if new_lr != old_lr:
            print(f"\nLearning rate decreased from {old_lr:.2e} to {new_lr:.2e}")
            lr_changes.append((epoch + 1, old_lr, new_lr))
        
        # Create and save loss plot with LR changes
        create_loss_plot(
            train_losses, 
            val_losses,
            lr_changes,
            os.path.join(model_dir, 'loss_history.png')
        )
        
        # Save loss history and LR changes
        np.savez(
            os.path.join(model_dir, 'loss_history.npz'),
            train_losses=np.array(train_losses),
            val_losses=np.array(val_losses),
            epochs=np.arange(1, len(train_losses) + 1),
            lr_changes=np.array(lr_changes, dtype=object)  # Save LR change history
        )
        
        # Print statistics
        print(f"\nEpoch {epoch+1}/{config['training']['epochs']}")
        print("Training Statistics:")
        print(f"  Loss: {train_stats['loss']:.6f}")
        print(f"  Target - Mean: {train_stats['target_mean']:.3f}, Std: {train_stats['target_std']:.3f}")
        print(f"  Output - Mean: {train_stats['output_mean']:.3f}, Std: {train_stats['output_std']:.3f}")
        print("Validation Statistics:")
        print(f"  Loss: {val_stats['loss']:.6f}")
        print(f"  Target - Mean: {val_stats['target_mean']:.3f}, Std: {val_stats['target_std']:.3f}")
        print(f"  Output - Mean: {val_stats['output_mean']:.3f}, Std: {val_stats['output_std']:.3f}")
        print(f"Current learning rate: {optimizer.param_groups[0]['lr']}")
        
        # Create and save visualization
        print(f"\nCreating visualization for epoch {epoch+1}...")
        create_field_plot(
            model, 
            device,
            model_type=config['model']['type'],
            save_path=os.path.join(plots_dir, f'epoch_{epoch+1:03d}.png')
        )
        
        # Save resume checkpoint
        torch.save({
            'epoch': epoch,
            'model': model,
            'optimizer_state_dict': optimizer.state_dict(),
            'scheduler_state_dict': scheduler.state_dict(),
            'val_loss': val_loss,
            'best_val_loss': best_val_loss,
            'train_stats': train_stats,
            'val_stats': val_stats,
            'train_losses': train_losses,
            'val_losses': val_losses,
            'lr_changes': lr_changes,
            'config': config,
        }, resume_path)

        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            print(f"\nNew best model! Val Loss: {val_loss:.6f}")
            torch.save({
                'epoch': epoch,
                'model': model,
                'optimizer_state_dict': optimizer.state_dict(),
                'scheduler_state_dict': scheduler.state_dict(),
                'val_loss': val_loss,
                'best_val_loss': best_val_loss,
                'train_stats': train_stats,
                'val_stats': val_stats,
                'train_losses': train_losses,
                'val_losses': val_losses,
                'lr_changes': lr_changes,
                'config': config,
            }, os.path.join(model_dir, 'model_best.pt'))

if __name__ == "__main__":
    main() 