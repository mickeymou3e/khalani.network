import torch
import torch.nn as nn

class BallAnticipationModel(nn.Module):
    def __init__(self, initial_delta_t=1.0, initial_friction=0.1):
        super(BallAnticipationModel, self).__init__()
        # Learnable parameters (positive constraint via softplus)
        self._raw_delta_t = nn.Parameter(torch.tensor([initial_delta_t], dtype=torch.float32))
        self._raw_friction = nn.Parameter(torch.tensor([initial_friction], dtype=torch.float32))
        self.softplus = nn.Softplus()

        # Simpler network: just one hidden layer
        self.net = nn.Sequential(
            nn.Linear(4, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Tanh()
        )

    def forward(self, x):
        # x shape: (batch_size, 24)
        # x: [ball_x, ball_y, ball_vx, ball_vy, ...player positions...]

        # Use softplus to ensure parameters stay positive
        delta_t = self.softplus(self._raw_delta_t)
        friction = self.softplus(self._raw_friction)

        # Compute anticipated ball position with friction
        ball_x = x[:, 0]
        ball_y = x[:, 1]
        ball_vx = x[:, 2]
        ball_vy = x[:, 3]

        exp_term = torch.exp(-friction * delta_t)
        # Avoid division by zero for very small friction
        friction_safe = friction + 1e-6
        delta_pos_x = (1 - exp_term) / friction_safe * ball_vx
        delta_pos_y = (1 - exp_term) / friction_safe * ball_vy

        anticipated_x = ball_x + delta_pos_x
        anticipated_y = ball_y + delta_pos_y

        # Concatenate: [ball_x, ball_y, anticipated_x, anticipated_y]
        features = torch.cat([
            ball_x.unsqueeze(1), ball_y.unsqueeze(1),
            anticipated_x.unsqueeze(1), anticipated_y.unsqueeze(1)
        ], dim=1)

        return self.net(features)

def print_physical_parameters(ckpt_path="outputs/ball_anticipation/model_best.pt"):
    # Load checkpoint
    checkpoint = torch.load(ckpt_path, map_location="cpu", weights_only=False)
    # ... rest of your code ... 