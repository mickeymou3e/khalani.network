import torch
import torch.nn as nn

class BallOnlyModel(nn.Module):
    def __init__(self):
        super(BallOnlyModel, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(4, 32),  # ball_x, ball_y, ball_vx, ball_vy
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Tanh()  # Constrain output to [-1, 1]
        )
    
    def forward(self, x):
        # Extract only ball-related features (first 4 features)
        ball_features = x[:, :4]
        return self.network(ball_features) 