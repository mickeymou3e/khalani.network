import torch
import torch.nn as nn
import math

class Triangle(nn.Module):
    def __init__(self, grid_size=(25, 40), initial_sigma_player=5.0, 
                 initial_sigma_ball=3.0, initial_delta_t=1.0, initial_friction=0.1,
                 goal_importance_sigma=15.0, slow_ball_threshold=2.0,
                 defensive_cone_angle=45.0):  # Angle in degrees
        super(Triangle, self).__init__()
        self.grid_size = grid_size
        self.slow_ball_threshold = slow_ball_threshold
        self.defensive_cone_angle = math.radians(defensive_cone_angle)

        self._raw_delta_t = nn.Parameter(torch.tensor([initial_delta_t], dtype=torch.float32))
        self._raw_friction = nn.Parameter(torch.tensor([initial_friction], dtype=torch.float32))
        self._raw_sigma_team1 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_team2 = nn.Parameter(torch.tensor([initial_sigma_player], dtype=torch.float32))
        self._raw_sigma_ball = nn.Parameter(torch.tensor([initial_sigma_ball], dtype=torch.float32))
        self.softplus = nn.Softplus()

        y_coords = torch.linspace(0, 60, grid_size[0])
        x_coords = torch.linspace(0, 100, grid_size[1])
        self.yy, self.xx = torch.meshgrid(y_coords, x_coords, indexing='ij')

        # Precompute a goal importance map (higher near both goals)
        goal1 = torch.tensor([0.0, 30.0])
        goal2 = torch.tensor([100.0, 30.0])
        sigma = goal_importance_sigma

        dist1 = (self.xx - goal1[0])**2 + (self.yy - goal1[1])**2
        dist2 = (self.xx - goal2[0])**2 + (self.yy - goal2[1])**2
        self.goal_importance = (
            torch.exp(-dist1 / (2 * sigma**2)) +
            torch.exp(-dist2 / (2 * sigma**2))
        )
        self.goal_importance = (self.goal_importance / self.goal_importance.max()).float()
        self.register_buffer('goal_importance_map', self.goal_importance)

        # Shallow conv layers
        self.conv_layers = nn.Sequential(
            nn.Conv2d(8, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        conv_output_size = self._get_conv_output_size()

        self.combined_net = nn.Sequential(
            nn.Linear(conv_output_size, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Tanh()
        )

    def _get_conv_output_size(self):
        h, w = self.grid_size
        h = h // 4
        w = w // 4
        return 32 * h * w

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

    def _calculate_possession_indicator(self, ball_pos, ball_vel, team1_positions, team2_positions):
        """Calculate possession indicator based on ball speed and team distances."""
        batch_size = ball_pos.shape[0]
        device = ball_pos.device

        # Ensure float32 for MPS compatibility
        ball_pos = ball_pos.to(torch.float32)
        ball_vel = ball_vel.to(torch.float32)
        team1_positions = team1_positions.to(torch.float32)
        team2_positions = team2_positions.to(torch.float32)

        # Calculate ball speed
        ball_speed = torch.norm(ball_vel, dim=1)
        
        # Calculate minimum distance from each team to the ball
        team1_distances = torch.norm(team1_positions - ball_pos.unsqueeze(1), dim=2)
        team2_distances = torch.norm(team2_positions - ball_pos.unsqueeze(1), dim=2)
        min_team1_dist = torch.min(team1_distances, dim=1)[0]
        min_team2_dist = torch.min(team2_distances, dim=1)[0]

        # Create possession indicator using torch.where
        possession = torch.zeros(batch_size, device=device, dtype=torch.float32)
        
        # Only consider possession when ball is moving slowly
        slow_ball_mask = ball_speed < self.slow_ball_threshold
        
        # Calculate which team is closer
        team1_closer = min_team1_dist < min_team2_dist
        
        # Use torch.where to set possession values
        possession = torch.where(
            slow_ball_mask & team1_closer,
            torch.ones_like(possession),
            torch.where(
                slow_ball_mask & ~team1_closer,
                -torch.ones_like(possession),
                torch.zeros_like(possession)
            )
        )

        return possession

    def _is_point_in_triangle(self, point, ball_pos, goal_pos, cone_angle):
        """Check if a point is within the defensive cone."""
        # Vector from ball to point
        ball_to_point = point - ball_pos
        
        # Vector from ball to goal
        ball_to_goal = goal_pos - ball_pos
        
        # Calculate angles
        angle = torch.atan2(ball_to_point[:, 1], ball_to_point[:, 0]) - \
                torch.atan2(ball_to_goal[1], ball_to_goal[0])
        
        # Normalize angle to [-pi, pi]
        angle = torch.atan2(torch.sin(angle), torch.cos(angle))
        
        # Check if point is within cone angle
        return torch.abs(angle) <= cone_angle

    def _calculate_defensive_pressure(self, ball_pos, team1_positions, team2_positions):
        """Calculate defensive pressure as number of players between ball and goal."""
        batch_size = ball_pos.shape[0]
        device = ball_pos.device
        
        # Ensure float32 for MPS compatibility
        ball_pos = ball_pos.to(torch.float32)
        team1_positions = team1_positions.to(torch.float32)
        team2_positions = team2_positions.to(torch.float32)
        
        # Define goal positions
        goal1_pos = torch.tensor([0.0, 30.0], device=device, dtype=torch.float32)
        goal2_pos = torch.tensor([100.0, 30.0], device=device, dtype=torch.float32)
        
        # Initialize pressure tensor
        pressure = torch.zeros(batch_size, device=device, dtype=torch.float32)
        
        for b in range(batch_size):
            # Count Team 1 players between ball and goal2
            team1_in_triangle = self._is_point_in_triangle(
                team1_positions[b],
                ball_pos[b],
                goal2_pos,
                self.defensive_cone_angle
            )
            team1_count = torch.sum(team1_in_triangle)
            
            # Count Team 2 players between ball and goal1
            team2_in_triangle = self._is_point_in_triangle(
                team2_positions[b],
                ball_pos[b],
                goal1_pos,
                self.defensive_cone_angle
            )
            team2_count = torch.sum(team2_in_triangle)
            
            # Pressure is positive when Team 1 has more players defending
            # and negative when Team 2 has more players defending
            pressure[b] = team1_count - team2_count
            
        return pressure

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

        # Calculate possession indicator
        possession = self._calculate_possession_indicator(
            ball_pos.squeeze(1), ball_vel, team1_positions, team2_positions
        )

        # Calculate defensive pressure
        defensive_pressure = self._calculate_defensive_pressure(
            ball_pos.squeeze(1), team1_positions, team2_positions
        )

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

        # Apply goal importance weighting
        importance = self.goal_importance_map.to(device)
        team1_influence = team1_influence * importance
        team2_influence = team2_influence * importance
        ball_influence = ball_influence * importance
        team1_possession = team1_possession * importance
        team2_possession = team2_possession * importance

        # Create possession influence map
        possession_map = torch.zeros((batch_size, *self.grid_size), device=device)
        for i in range(batch_size):
            possession_map[i] = possession[i] * ball_influence[i]

        spatial_features = torch.stack([
            team1_influence,
            team2_influence,
            ball_influence,
            team1_possession,
            team2_possession,
            possession_map,
            defensive_pressure.unsqueeze(1).unsqueeze(2).expand(-1, *self.grid_size),
            torch.zeros_like(team1_influence)
        ], dim=1)

        spatial_features = self.conv_layers(spatial_features)
        spatial_features = spatial_features.flatten(1)
        return self.combined_net(spatial_features) 