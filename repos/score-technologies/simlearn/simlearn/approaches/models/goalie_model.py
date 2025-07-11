import torch
import torch.nn as nn

class GoalieModel(nn.Module):
    def __init__(self, initial_delta_t=1.0, initial_friction=0.1):
        super(GoalieModel, self).__init__()
        # Learnable parameters for physics (positive constraint via softplus)
        self._raw_delta_t = nn.Parameter(torch.tensor([initial_delta_t], dtype=torch.float32))
        self._raw_friction = nn.Parameter(torch.tensor([initial_friction], dtype=torch.float32))
        self.softplus = nn.Softplus()

        # Ball anticipation network (similar to BallAnticipationModel)
        self.ball_net = nn.Sequential(
            nn.Linear(4, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU()
        )

        # Goal defense network
        # Input: goalkeeper position (2), ball position (2), anticipated ball position (2)
        self.defense_net = nn.Sequential(
            nn.Linear(6, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )

        # Combined network for final prediction
        self.combined_net = nn.Sequential(
            nn.Linear(96, 128),  # 64 (ball) + 32 (defense)
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.Tanh()
        )

    def forward(self, x):
        # x shape: (batch_size, 24)
        # x: [ball_x, ball_y, ball_vx, ball_vy, goalkeeper_x, goalkeeper_y, ...other players...]

        # Use softplus to ensure parameters stay positive
        delta_t = self.softplus(self._raw_delta_t)
        friction = self.softplus(self._raw_friction)

        # Extract ball and goalkeeper positions
        ball_x = x[:, 0]
        ball_y = x[:, 1]
        ball_vx = x[:, 2]
        ball_vy = x[:, 3]
        goalkeeper_x = x[:, 4]  # Assuming goalkeeper is first player
        goalkeeper_y = x[:, 5]

        # Compute anticipated ball position with friction
        exp_term = torch.exp(-friction * delta_t)
        friction_safe = friction + 1e-6  # Avoid division by zero
        
        # Calculate position change due to velocity and friction
        delta_pos_x = (1 - exp_term) / friction_safe * ball_vx
        delta_pos_y = (1 - exp_term) / friction_safe * ball_vy

        # Anticipated position
        anticipated_x = ball_x + delta_pos_x
        anticipated_y = ball_y + delta_pos_y

        # Process ball trajectory
        ball_features = torch.cat([
            ball_x.unsqueeze(1), ball_y.unsqueeze(1),
            ball_vx.unsqueeze(1), ball_vy.unsqueeze(1)
        ], dim=1)
        ball_encoding = self.ball_net(ball_features)

        # Process goal defense
        defense_features = torch.cat([
            goalkeeper_x.unsqueeze(1), goalkeeper_y.unsqueeze(1),
            ball_x.unsqueeze(1), ball_y.unsqueeze(1),
            anticipated_x.unsqueeze(1), anticipated_y.unsqueeze(1)
        ], dim=1)
        defense_encoding = self.defense_net(defense_features)

        # Combine features and make final prediction
        combined = torch.cat([ball_encoding, defense_encoding], dim=1)
        return self.combined_net(combined)

    def get_physical_params(self):
        """Return the learned physical parameters."""
        with torch.no_grad():
            delta_t = self.softplus(self._raw_delta_t).item()
            friction = self.softplus(self._raw_friction).item()
        return {'delta_t': delta_t, 'friction': friction} 