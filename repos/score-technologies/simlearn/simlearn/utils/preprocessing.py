import torch
import numpy as np

class SoccerScaler:
    """Scales soccer game features to symmetric, centered ranges."""
    
    def __init__(self):
        # Field dimensions
        self.field_width = 100.0
        self.field_height = 60.0
        
        # Center for symmetry
        self.x_center = self.field_width / 2   # 50.0
        self.y_center = self.field_height / 2  # 30.0
        
        # For scaling to [-1, 1]
        self.x_scale = self.x_center           # 50.0
        self.y_scale = self.y_center           # 30.0
        
        # Velocity scaling (assuming velocities are within ±40 units)
        self.velocity_scale = 40.0
        
    def scale_features(self, X):
        """
        Scale features to symmetric [-1, 1] range, centered at field center.
        
        Args:
            X: tensor of shape (batch_size, 24) containing:
               [ball_x, ball_y, ball_vx, ball_vy, 
                team1_player1_x, team1_player1_y, ..., 
                team2_player5_x, team2_player5_y]
        """
        X = X.clone()
        
        # Center and scale ball position
        X[:, 0] = (X[:, 0] - self.x_center) / self.x_scale  # ball_x: [-1, 1], 0=center
        X[:, 1] = (X[:, 1] - self.y_center) / self.y_scale  # ball_y: [-1, 1], 0=center
        
        # Scale velocities (no centering, just scaling)
        X[:, 2:4] = X[:, 2:4] / self.velocity_scale  # vx, vy to roughly [-1, 1]
        
        # Center and scale player positions
        for i in range(10):  # 5 players per team * 2 teams
            x_idx = 4 + i * 2
            y_idx = 5 + i * 2
            X[:, x_idx] = (X[:, x_idx] - self.x_center) / self.x_scale
            X[:, y_idx] = (X[:, y_idx] - self.y_center) / self.y_scale
        
        return X
    
    def unscale_features(self, X):
        """Convert scaled features back to original range."""
        X = X.clone()
        
        # Unscale positions
        X[:, 0] = X[:, 0] * self.x_scale + self.x_center
        X[:, 1] = X[:, 1] * self.y_scale + self.y_center
        
        # Unscale velocities
        X[:, 2:4] = X[:, 2:4] * self.velocity_scale
        
        # Unscale player positions
        for i in range(10):
            x_idx = 4 + i * 2
            y_idx = 5 + i * 2
            X[:, x_idx] = X[:, x_idx] * self.x_scale + self.x_center
            X[:, y_idx] = X[:, y_idx] * self.y_scale + self.y_center
        
        return X

class MovingAverageScaler:
    """
    Computes running statistics for online scaling.
    Useful for handling velocity statistics that might need adaptation.
    """
    def __init__(self, momentum=0.99):
        self.momentum = momentum
        self.running_mean = None
        self.running_var = None
        
    def update(self, x):
        if self.running_mean is None:
            self.running_mean = torch.zeros_like(x.mean(0))
            self.running_var = torch.ones_like(x.var(0))
        
        batch_mean = x.mean(0)
        batch_var = x.var(0)
        
        self.running_mean = (self.momentum * self.running_mean + 
                           (1 - self.momentum) * batch_mean)
        self.running_var = (self.momentum * self.running_var + 
                          (1 - self.momentum) * batch_var)
    
    def scale(self, x):
        return (x - self.running_mean) / (torch.sqrt(self.running_var) + 1e-5)
    
    def unscale(self, x):
        return x * torch.sqrt(self.running_var + 1e-5) + self.running_mean 