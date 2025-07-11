import torch
import torch.nn as nn
import torch.nn.functional as F

class SpatialInfluenceModel(nn.Module):
    def __init__(self, grid_size=(50, 80), initial_sigma_player=5.0, 
                 initial_sigma_ball=3.0, initial_delta_t=1.0, initial_friction=0.1):
        super(SpatialInfluenceModel, self).__init__()
        """
        Args:
            grid_size: (height, width) of the field discretization
            initial_sigma_player: Initial value for Gaussian kernel spread for players
            initial_sigma_ball: Initial value for Gaussian kernel spread for the ball
            initial_delta_t: Initial value for time step in ball physics
            initial_friction: Initial value for friction coefficient
        """
        self.grid_size = grid_size
        
        # Learnable physics parameters from BallAnticipationModel
        self._raw_delta_t = nn.Parameter(torch.tensor([initial_delta_t], dtype=torch.float32))
        self._raw_friction = nn.Parameter(torch.tensor([initial_friction], dtype=torch.float32))
        
        # Learnable smoothing parameter (one for each team)
        self._raw_sigma_team1 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_team2 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_ball = nn.Parameter(torch.tensor([initial_sigma_ball], dtype=torch.float32))
        self.softplus = nn.Softplus()
        
        # Create coordinate grid once
        y_coords = torch.linspace(0, 60, grid_size[0])
        x_coords = torch.linspace(0, 100, grid_size[1])
        self.yy, self.xx = torch.meshgrid(y_coords, x_coords, indexing='ij')
        
        # Ball anticipation network (same as BallAnticipationModel)
        self.ball_net = nn.Sequential(
            nn.Linear(4, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU()
        )
        
        # Calculate conv output size first
        conv_output_size = self._get_conv_output_size()
        
        # Updated convolutional layers (5 input channels)
        self.conv_layers = nn.Sequential(
            nn.Conv2d(5, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        
        # Final layers with correct input size
        self.combined_net = nn.Sequential(
            nn.Linear(conv_output_size, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Tanh()
        )

    def _get_conv_output_size(self):
        """Calculate the size of the flattened conv output"""
        h, w = self.grid_size
        h = h // 4  # After two MaxPool2d
        w = w // 4
        channels = 64  # Number of output channels in last conv layer
        return channels * h * w

    def _create_influence_map(self, positions, sigma):
        """
        Create influence map for one team
        Args:
            positions: tensor of shape (batch_size, num_players, 2) with x,y coordinates
            sigma: smoothing parameter for this team
        Returns:
            Influence map of shape (batch_size, grid_height, grid_width)
        """
        batch_size = positions.shape[0]
        device = positions.device
        
        # Move coordinate grids to correct device
        xx = self.xx.to(device)
        yy = self.yy.to(device)
        
        # Initialize influence map
        influence = torch.zeros((batch_size, *self.grid_size), device=device)
        
        # For each player
        for player_pos in positions.transpose(0, 1):  # shape: (num_players, batch_size, 2)
            # Calculate Gaussian influence
            x_pos = player_pos[..., 0].unsqueeze(-1).unsqueeze(-1)  # Add spatial dims
            y_pos = player_pos[..., 1].unsqueeze(-1).unsqueeze(-1)
            
            # Gaussian kernel
            squared_dist = (xx - x_pos)**2 + (yy - y_pos)**2
            influence += torch.exp(-squared_dist / (2 * sigma**2))
        
        return influence

    def forward(self, x):
        batch_size = x.shape[0]
        device = x.device
        
        # Get learnable parameters
        delta_t = self.softplus(self._raw_delta_t)
        friction = self.softplus(self._raw_friction)
        sigma_team1 = self.softplus(self._raw_sigma_team1)
        sigma_team2 = self.softplus(self._raw_sigma_team2)
        sigma_ball = self.softplus(self._raw_sigma_ball)
        
        # Extract positions
        ball_pos = x[:, :2].view(batch_size, 1, 2)
        ball_vel = x[:, 2:4]
        team1_positions = x[:, 4:14].view(batch_size, 5, 2)
        team2_positions = x[:, 14:24].view(batch_size, 5, 2)
        
        # Compute anticipated ball position
        exp_term = torch.exp(-friction * delta_t)
        friction_safe = friction + 1e-6
        delta_pos = (1 - exp_term) / friction_safe * ball_vel
        anticipated_ball_pos = ball_pos + delta_pos.unsqueeze(1)
        
        # Create base influence maps
        team1_influence = self._create_influence_map(team1_positions, sigma_team1)
        team2_influence = self._create_influence_map(team2_positions, sigma_team2)
        current_ball_influence = self._create_influence_map(ball_pos, sigma_ball)
        anticipated_ball_influence = self._create_influence_map(anticipated_ball_pos, sigma_ball)
        
        # Combined ball influence (current and anticipated)
        ball_influence = (current_ball_influence + anticipated_ball_influence) / 2
        
        # Create possession potential maps (element-wise multiplication)
        team1_possession = team1_influence * ball_influence
        team2_possession = team2_influence * ball_influence
        
        # Stack all features: team influences, ball influence, and possession potentials
        spatial_features = torch.stack([
            team1_influence,      # Channel 0: Team 1 raw influence
            team2_influence,      # Channel 1: Team 2 raw influence
            ball_influence,       # Channel 2: Ball influence
            team1_possession,     # Channel 3: Team 1 possession potential
            team2_possession      # Channel 4: Team 2 possession potential
        ], dim=1)
        
        # Update conv layers input channels (now 5 instead of 3)
        spatial_features = self.conv_layers(spatial_features)
        spatial_features = spatial_features.flatten(1)
        
        return self.combined_net(spatial_features)

    def get_parameters(self):
        """Return the learned parameters"""
        with torch.no_grad():
            return {
                'delta_t': self.softplus(self._raw_delta_t).item(),
                'friction': self.softplus(self._raw_friction).item(),
                'sigma_team1': self.softplus(self._raw_sigma_team1).item(),
                'sigma_team2': self.softplus(self._raw_sigma_team2).item(),
                'sigma_ball': self.softplus(self._raw_sigma_ball).item()
            }

    def get_influence_maps(self, x):
        """
        Return influence maps for visualization
        """
        batch_size = x.shape[0]
        team1_positions = x[:, 4:14].view(batch_size, 5, 2)
        team2_positions = x[:, 14:24].view(batch_size, 5, 2)
        
        sigma_team1 = self.softplus(self._raw_sigma_team1)
        sigma_team2 = self.softplus(self._raw_sigma_team2)
        sigma_ball = self.softplus(self._raw_sigma_ball)
        
        team1_influence = self._create_influence_map(team1_positions, sigma_team1)
        team2_influence = self._create_influence_map(team2_positions, sigma_team2)
        
        # Get anticipated ball position
        delta_t = self.softplus(self._raw_delta_t)
        friction = self.softplus(self._raw_friction)
        
        ball_pos = x[:, :2].view(batch_size, 1, 2)
        ball_vel = x[:, 2:4]
        
        exp_term = torch.exp(-friction * delta_t)
        friction_safe = friction + 1e-6
        delta_pos = (1 - exp_term) / friction_safe * ball_vel
        anticipated_ball_pos = ball_pos + delta_pos.unsqueeze(1)
        
        current_ball_influence = self._create_influence_map(ball_pos, sigma_ball)
        anticipated_ball_influence = self._create_influence_map(anticipated_ball_pos, sigma_ball)
        
        # Combined ball influence (current and anticipated)
        ball_influence = (current_ball_influence + anticipated_ball_influence) / 2
        
        # Create possession potential maps (element-wise multiplication)
        team1_possession = team1_influence * ball_influence
        team2_possession = team2_influence * ball_influence
        
        return {
            'team1_influence': team1_influence,
            'team2_influence': team2_influence,
            'current_ball_influence': current_ball_influence,
            'anticipated_ball_influence': anticipated_ball_influence,
            'team1_possession': team1_possession,
            'team2_possession': team2_possession,
            'sigma_team1': sigma_team1.item(),
            'sigma_team2': sigma_team2.item(),
            'sigma_ball': sigma_ball.item(),
            'delta_t': delta_t.item(),
            'friction': friction.item()
        } 