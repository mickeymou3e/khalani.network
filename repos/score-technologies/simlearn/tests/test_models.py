import pytest
import torch
from simlearn.approaches.models.simple import BallOnlyModel
from simlearn.approaches.models.full import FullModel

@pytest.fixture
def sample_batch():
    # Create a batch of 32 samples with full feature set
    batch_size = 32
    X = torch.randn(batch_size, 24)  # 24 features total
    y = torch.randint(-1, 2, (batch_size,), dtype=torch.float32)  # -1 or 1 outcomes
    return X, y

def test_ball_only_model():
    model = BallOnlyModel()
    batch_size = 16
    
    # Create input with full feature set
    x = torch.randn(batch_size, 24)
    
    # Forward pass
    output = model(x)
    
    # Check output shape and type
    assert output.shape == (batch_size, 1)
    assert output.dtype == torch.float32
    assert torch.all(output >= -1) and torch.all(output <= 1)  # Check output range
    
    # Test if model is differentiable
    loss = output.mean()
    loss.backward()
    
    # Check if gradients were computed
    assert model.network[0].weight.grad is not None

def test_full_model():
    model = FullModel()
    batch_size = 16
    
    # Create input with all features
    x = torch.randn(batch_size, 24)
    
    # Forward pass
    output = model(x)
    
    # Check output shape and type
    assert output.shape == (batch_size, 1)
    assert output.dtype == torch.float32
    assert torch.all(output >= -1) and torch.all(output <= 1)  # Check output range
    
    # Test if model is differentiable
    loss = output.mean()
    loss.backward()
    
    # Check if all components have gradients
    assert model.ball_net[0].weight.grad is not None
    assert model.team_net[0].weight.grad is not None
    assert model.combined_net[0].weight.grad is not None 