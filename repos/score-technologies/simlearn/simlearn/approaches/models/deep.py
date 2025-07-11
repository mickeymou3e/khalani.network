import torch
import torch.nn as nn

class DeepModel(nn.Module):
    def __init__(self):
        super(DeepModel, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(4, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Tanh()
        )

    def forward(self, x):
        # Use only the first 4 features (ball_x, ball_y, ball_vx, ball_vy)
        ball_features = x[:, :4]
        return self.network(ball_features) 