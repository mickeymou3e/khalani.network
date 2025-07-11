import torch
import torch.nn as nn

class ShallowerSpatial(nn.Module):
    def __init__(self, grid_size=(50, 80), initial_sigma_player=5.0, 
                 initial_sigma_ball=3.0, initial_delta_t=1.0, initial_friction=0.1):
        super(ShallowerSpatial, self).__init__()
        self.grid_size = grid_size

        self._raw_delta_t = nn.Parameter(torch.tensor([initial_delta_t], dtype=torch.float32))
        self._raw_friction = nn.Parameter(torch.tensor([initial_friction], dtype=torch.float32))
        self._raw_sigma_team1 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_team2 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_ball = nn.Parameter(torch.tensor([initial_sigma_ball], dtype=torch.float32))
        self.softplus = nn.Softplus()

        y_coords = torch.linspace(0, 60, grid_size[0])
        x_coords = torch.linspace(0, 100, grid_size[1])
        self.yy, self.xx = torch.meshgrid(y_coords, x_coords, indexing='ij')

        # Only one conv layer and one maxpool
        self.conv_layers = nn.Sequential(
            nn.Conv2d(5, 8, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        conv_output_size = self._get_conv_output_size()

        self.combined_net = nn.Sequential(
            nn.Linear(conv_output_size, 1),
            nn.Tanh()
        )

    def _get_conv_output_size(self):
        h, w = self.grid_size
        h = h // 2
        w = w // 2
        return 8 * h * w

    def _create_influence_map(self, positions, sigma):
        batch_size = positions.shape[0]
        device = positions.device
        xx = self.xx.to(device)
        yy = self.yy.to(device)
        influence = torch.zeros((batch_size, *self.grid_size), device=device)
        for pos in positions.transpose(0, 1):
            x_pos = pos[..., 0].unsqueeze(-1).unsqueeze(-1)
            y_pos = pos[..., 1].unsqueeze(-1).unsqueeze(-1)
            squared_dist = (xx - x_pos)**2 + (yy - y_pos)**2
            influence += torch.exp(-squared_dist / (2 * sigma**2))
        return influence

    def forward(self, x):
        batch_size = x.shape[0]
        device = x.device
        delta_t = self.softplus(self._raw_delta_t)
        friction = self.softplus(self._raw_friction)
        sigma_team1 = self.softplus(self._raw_sigma_team1)
        sigma_team2 = self.softplus(self._raw_sigma_team2)
        sigma_ball = self.softplus(self._raw_sigma_ball)

        ball_pos = x[:, :2].view(batch_size, 1, 2)
        ball_vel = x[:, 2:4]
        team1_positions = x[:, 4:14].view(batch_size, 5, 2)
        team2_positions = x[:, 14:24].view(batch_size, 5, 2)

        exp_term = torch.exp(-friction * delta_t)
        friction_safe = friction + 1e-6
        delta_pos = (1 - exp_term) / friction_safe * ball_vel
        anticipated_ball_pos = ball_pos + delta_pos.unsqueeze(1)

        team1_influence = self._create_influence_map(team1_positions, sigma_team1)
        team2_influence = self._create_influence_map(team2_positions, sigma_team2)
        current_ball_influence = self._create_influence_map(ball_pos, sigma_ball)
        anticipated_ball_influence = self._create_influence_map(anticipated_ball_pos, sigma_ball)
        ball_influence = (current_ball_influence + anticipated_ball_influence) / 2

        team1_possession = team1_influence * ball_influence
        team2_possession = team2_influence * ball_influence

        spatial_features = torch.stack([
            team1_influence,
            team2_influence,
            ball_influence,
            team1_possession,
            team2_possession
        ], dim=1)

        spatial_features = self.conv_layers(spatial_features)
        spatial_features = spatial_features.flatten(1)
        return self.combined_net(spatial_features) 