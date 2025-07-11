import pytest
import torch
from simlearn.utils.preprocessing import SoccerScaler, MovingAverageScaler

@pytest.fixture
def sample_batch():
    batch_size = 32
    X = torch.zeros(batch_size, 24)  # 24 features total
    
    # Set some sample values
    X[:, 0] = 50.0  # middle of field width
    X[:, 1] = 30.0  # middle of field height
    X[:, 2] = 5.0   # some velocity
    X[:, 3] = -3.0  # some velocity
    
    # Set some player positions
    for i in range(5):  # team1
        X[:, 4+i*2] = 20.0 + i*10  # x positions
        X[:, 5+i*2] = 30.0         # y positions
    
    for i in range(5):  # team2
        X[:, 14+i*2] = 80.0 - i*10  # x positions
        X[:, 15+i*2] = 30.0         # y positions
    
    return X

def test_soccer_scaler(sample_batch):
    scaler = SoccerScaler()
    
    # Test scaling
    scaled = scaler.scale_features(sample_batch)
    
    # Check ranges
    assert torch.all(scaled >= -1.1) and torch.all(scaled <= 1.1)
    
    # Test specific values
    assert torch.isclose(scaled[0, 0], torch.tensor(0.0), atol=1e-6)  # middle of field x
    assert torch.isclose(scaled[0, 1], torch.tensor(0.0), atol=1e-6)  # middle of field y
    
    # Test velocities are properly scaled
    assert torch.isclose(scaled[0, 2], torch.tensor(5.0/40.0), atol=1e-6)
    assert torch.isclose(scaled[0, 3], torch.tensor(-3.0/40.0), atol=1e-6)
    
    # Test roundtrip
    unscaled = scaler.unscale_features(scaled)
    assert torch.allclose(unscaled, sample_batch, rtol=1e-5)

def test_moving_average_scaler():
    scaler = MovingAverageScaler(momentum=0.9)  # Lower momentum for faster convergence in test
    
    # Generate some data with known statistics
    mean = torch.tensor([1.0, -1.0])
    std = torch.tensor([2.0, 0.5])
    
    # More iterations and larger batch size for better convergence
    for _ in range(1000):
        batch = torch.randn(128, 2) * std + mean
        scaler.update(batch)
    
    # Check if running statistics are close to true values (with larger tolerance)
    assert torch.allclose(scaler.running_mean, mean, rtol=0.2)
    assert torch.allclose(torch.sqrt(scaler.running_var), std, rtol=0.2) 