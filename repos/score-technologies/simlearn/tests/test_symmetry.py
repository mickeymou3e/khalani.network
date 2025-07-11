import pytest
import torch
import pandas as pd
import numpy as np
from simlearn.utils.symmetry import reflection_symmetry_1, reflection_symmetry_2, permutation_symmetry

@pytest.fixture
def sample_data():
    # Create a sample tensor with the correct structure:
    # [ball_x, ball_y, ball_vx, ball_vy, 
    #  team1_0_x, team1_0_y, team1_1_x, team1_1_y, team1_2_x, team1_2_y, team1_3_x, team1_3_y, team1_4_x, team1_4_y,
    #  team2_0_x, team2_0_y, team2_1_x, team2_1_y, team2_2_x, team2_2_y, team2_3_x, team2_3_y, team2_4_x, team2_4_y]
    data = torch.tensor([
        [
            50.0, 30.0, 5.0, 2.0,  # ball
            20.0, 30.0, 25.0, 35.0, 30.0, 40.0, 35.0, 45.0, 40.0, 50.0,  # team1
            80.0, 30.0, 75.0, 25.0, 70.0, 20.0, 65.0, 15.0, 60.0, 10.0,  # team2
        ]
    ])
    return data

def test_reflection_symmetry_1(sample_data):
    transformed = reflection_symmetry_1(sample_data)
    
    # Check y coordinates are reflected (60 - y)
    assert transformed[0, 1] == 60 - sample_data[0, 1]  # ball_y
    assert transformed[0, 5] == 60 - sample_data[0, 5]  # team1_0_y
    
    # Check vy is negated
    assert transformed[0, 3] == -sample_data[0, 3]  # ball_vy
    
    # Check x coordinates remain unchanged
    assert transformed[0, 0] == sample_data[0, 0]  # ball_x
    assert transformed[0, 4] == sample_data[0, 4]  # team1_0_x

def test_reflection_symmetry_2(sample_data):
    transformed = reflection_symmetry_2(sample_data)
    
    # Check x coordinates are reflected (100 - x)
    assert transformed[0, 0] == 100 - sample_data[0, 0]  # ball_x
    assert transformed[0, 4] == 100 - sample_data[0, 4]  # team1_0_x
    
    # Check vx is negated
    assert transformed[0, 2] == -sample_data[0, 2]  # ball_vx
    
    # Check y coordinates remain unchanged
    assert transformed[0, 1] == sample_data[0, 1]  # ball_y
    assert transformed[0, 5] == sample_data[0, 5]  # team1_0_y

def test_reflection_symmetry_2_with_outcome():
    # Test x-reflection with outcome
    X = torch.tensor([[50.0, 30.0, 5.0, 2.0,  # ball
                      20.0, 30.0, 25.0, 35.0, 30.0, 40.0, 35.0, 45.0, 40.0, 50.0,  # team1
                      80.0, 30.0, 75.0, 25.0, 70.0, 20.0, 65.0, 15.0, 60.0, 10.0]])  # team2
    y = torch.tensor([1.0])
    
    transformed_X, transformed_y = reflection_symmetry_2(X, y)
    
    # Check x coordinate is reflected
    assert transformed_X[0, 0] == 100 - X[0, 0]
    # Check outcome is negated
    assert transformed_y[0] == -y[0]

def test_permutation_symmetry(sample_data):
    transformed = permutation_symmetry(sample_data, team="team1")
    
    # Get original team1 coordinates (5 players, each with x,y)
    original_team1 = sample_data[0, 4:14].reshape(5, 2)
    transformed_team1 = transformed[0, 4:14].reshape(5, 2)
    
    # Check that the coordinates are permuted but preserved
    assert set(tuple(coord.tolist()) for coord in original_team1) == \
           set(tuple(coord.tolist()) for coord in transformed_team1)
    
    # Check that other coordinates remain unchanged
    assert torch.equal(transformed[0, :4], sample_data[0, :4])  # ball coordinates
    assert torch.equal(transformed[0, 14:], sample_data[0, 14:])  # team2 coordinates 