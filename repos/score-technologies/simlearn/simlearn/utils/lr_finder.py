import torch
import numpy as np
import matplotlib.pyplot as plt
from copy import deepcopy
from tqdm import tqdm

class LRFinder:
    def __init__(self, model, optimizer, criterion, device):
        self.model = model
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device
        
        # Save original model and optimizer state
        self.model_state = deepcopy(model.state_dict())
        self.optim_state = deepcopy(optimizer.state_dict())
    
    def reset(self):
        """Restore the original model and optimizer state."""
        self.model.load_state_dict(self.model_state)
        self.optimizer.load_state_dict(self.optim_state)
    
    def find(self, train_loader, start_lr=1e-7, end_lr=10, num_iter=100, step_mode="exp"):
        """
        Find optimal learning rate by exponentially increasing it and tracking loss.
        
        Args:
            train_loader: DataLoader for training data
            start_lr: Starting learning rate
            end_lr: Maximum learning rate to try
            num_iter: Number of iterations to run
            step_mode: How to increase learning rate ("exp" or "linear")
        """
        # Track learning rates and losses
        self.history = {"lr": [], "loss": []}
        
        # Calculate learning rate update factor
        if step_mode == "exp":
            lr_factor = (end_lr / start_lr) ** (1 / num_iter)
        else:
            lr_step = (end_lr - start_lr) / num_iter
        
        # Set initial learning rate
        for param_group in self.optimizer.param_groups:
            param_group['lr'] = start_lr
        
        # Initialize running loss (using moving average)
        running_loss = None
        avg_beta = 0.98
        
        iterator = iter(train_loader)
        for iteration in tqdm(range(num_iter), desc="Finding learning rate"):
            try:
                batch = next(iterator)
            except StopIteration:
                iterator = iter(train_loader)
                batch = next(iterator)
            
            # Get batch
            features = batch['features'].to(self.device)
            targets = batch['target'].to(self.device)
            
            # Forward pass
            self.optimizer.zero_grad()
            outputs = self.model(features)
            loss = self.criterion(outputs.squeeze(), targets)
            
            # Backward pass
            loss.backward()
            self.optimizer.step()
            
            # Update running loss
            if running_loss is None:
                running_loss = loss.item()
            else:
                running_loss = avg_beta * running_loss + (1 - avg_beta) * loss.item()
            
            # Store current values
            current_lr = self.optimizer.param_groups[0]['lr']
            self.history["lr"].append(current_lr)
            self.history["loss"].append(running_loss)
            
            # Update learning rate
            if step_mode == "exp":
                new_lr = current_lr * lr_factor
            else:
                new_lr = current_lr + lr_step
                
            for param_group in self.optimizer.param_groups:
                param_group['lr'] = new_lr
            
            # Stop if loss explodes
            if running_loss > 4 * min(self.history["loss"]):
                break
        
        return self.history
    
    def plot(self, skip_start=10, skip_end=5, save_path='outputs/lr_finder.png'):
        """
        Plot the learning rate vs loss curve.
        
        Args:
            skip_start: Number of batches to skip at the start
            skip_end: Number of batches to skip at the end
            save_path: Path to save the plot
        """
        lrs = self.history["lr"][skip_start:-skip_end]
        losses = self.history["loss"][skip_start:-skip_end]
        
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(lrs, losses)
        ax.set_xscale('log')
        ax.set_xlabel('Learning Rate')
        ax.set_ylabel('Loss')
        ax.set_title('Learning Rate Finder')
        ax.grid(True)
        
        # Add vertical lines at suggested learning rates
        min_grad_idx = np.gradient(losses).argmin()
        suggested_lr = lrs[min_grad_idx]
        ax.axvline(x=suggested_lr, color='r', linestyle='--', alpha=0.5,
                  label=f'Suggested LR: {suggested_lr:.2e}')
        
        conservative_lr = suggested_lr / 10
        ax.axvline(x=conservative_lr, color='g', linestyle='--', alpha=0.5,
                  label=f'Conservative LR: {conservative_lr:.2e}')
        
        ax.legend()
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        return suggested_lr, conservative_lr 