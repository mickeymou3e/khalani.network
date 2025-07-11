import torch

def reflection_symmetry_1(X):
    """
    Apply reflection symmetry 1:
    1. Replace values y in all columns ending in _y with 60-y
    2. Replace values vy in all columns ending in _vy with -vy
    """
    X = X.clone()
    
    # Hardcoded indices for y coordinates (every second index starting from 1)
    y_cols = [1]  # ball_y
    for i in range(5):  # 5 players per team
        y_cols.extend([5 + i*2, 15 + i*2])  # team1 and team2 y coordinates
    
    # Hardcoded indices for vy (index 3)
    vy_cols = [3]  # ball_vy
    
    # Apply transformations
    X[:, y_cols] = 60 - X[:, y_cols]
    X[:, vy_cols] = -X[:, vy_cols]
    
    return X

def reflection_symmetry_2(X, y=None):
    """
    Apply reflection symmetry 2:
    1. Replace values x in all columns ending in _x with 100-x
    2. Replace values vx in all columns ending in _vx with -vx
    3. Replace values o in the outcome column with -o
    """
    X = X.clone()
    if y is not None:
        y = y.clone()
    
    # Hardcoded indices for x coordinates (every second index starting from 0)
    x_cols = [0]  # ball_x
    for i in range(5):  # 5 players per team
        x_cols.extend([4 + i*2, 14 + i*2])  # team1 and team2 x coordinates
    
    # Hardcoded indices for vx (index 2)
    vx_cols = [2]  # ball_vx
    
    # Apply transformations
    X[:, x_cols] = 100 - X[:, x_cols]
    X[:, vx_cols] = -X[:, vx_cols]
    
    if y is not None:
        y = -y
        return X, y
    return X

def permutation_symmetry(X, team="team1"):
    """
    Apply permutation symmetry by randomly permuting players within a team
    """
    X = X.clone()
    
    # Get indices for team players
    team_cols = []
    start_idx = 4 if team == "team1" else 14  # Starting index for team coordinates
    
    for i in range(5):  # 5 players per team
        player_cols = [start_idx + i*2, start_idx + i*2 + 1]  # x,y coordinates for each player
        team_cols.append(player_cols)
    
    # Random permutation
    perm = torch.randperm(5)
    
    # Apply permutation
    new_X = X.clone()
    for i, p in enumerate(perm):
        for j, col in enumerate(team_cols[i]):
            new_X[:, col] = X[:, team_cols[p][j]]
    
    return new_X 