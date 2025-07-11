import torch
import torch.nn as nn

class FullModel(nn.Module):
    def __init__(self):
        super(FullModel, self).__init__()
        
        # Ball processing (shallower network)
        self.ball_net = nn.Sequential(
            nn.Linear(4, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU()
        )
        
        # Team 1 processing (shallower network)
        self.team1_net = nn.Sequential(
            nn.Linear(10, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU()
        )
        
        # Team 2 processing (shallower network)
        self.team2_net = nn.Sequential(
            nn.Linear(10, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU()
        )
        
        # Combined processing (shallower network)
        self.combined_net = nn.Sequential(
            nn.Linear(48, 32),  # 16 (ball) + 16 (team1) + 16 (team2)
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Tanh()  # Constrain output to [-1, 1]
        )
    
    def forward(self, x):
        # Split input into components
        ball_features = x[:, :4]
        team1_features = x[:, 4:14]
        team2_features = x[:, 14:24]
        
        # Process components with separate networks
        ball_out = self.ball_net(ball_features)
        team1_out = self.team1_net(team1_features)
        team2_out = self.team2_net(team2_features)
        
        # Combine and process
        combined = torch.cat([ball_out, team1_out, team2_out], dim=1)
        return self.combined_net(combined) 