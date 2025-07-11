import torch
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
from simlearn.approaches.models.registry import ModelRegistry

def create_example_positions(ball_pos=(50, 30), ball_vel=(0, 0),
                           team1_positions=None, team2_positions=None):
    """Create example position data in the correct format."""
    if team1_positions is None:
        # Default attacking formation for team 1
        team1_positions = [
            (60, 30),  # Striker
            (45, 20), (45, 40),  # Midfielders
            (30, 15), (30, 45),  # Defenders
        ]
    
    if team2_positions is None:
        # Default defensive formation for team 2
        team2_positions = [
            (80, 30),  # Goalkeeper
            (70, 20), (70, 40),  # Defenders
            (65, 15), (65, 45),  # Wide defenders
        ]
    
    # Combine all positions into one tensor
    features = torch.tensor([
        ball_pos[0], ball_pos[1],  # Ball position
        ball_vel[0], ball_vel[1],  # Ball velocity
        *[coord for pos in team1_positions for coord in pos],  # Team 1
        *[coord for pos in team2_positions for coord in pos],  # Team 2
    ], dtype=torch.float32).unsqueeze(0)  # Add batch dimension
    
    return features

def plot_influence_maps(model, features, save_path=None, show=True):
    """Plot all influence maps for a given situation."""
    model.eval()
    with torch.no_grad():
        maps = model.get_influence_maps(features)
    
    # Create a figure with subplots
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle(f'Spatial Influence Analysis\n' + 
                f'σ_ball={maps["sigma_ball"]:.2f}, σ_team1={maps["sigma_team1"]:.2f}, σ_team2={maps["sigma_team2"]:.2f}')
    
    # Extract positions for plotting
    ball_pos = features[0, :2].numpy()
    ball_vel = features[0, 2:4].numpy()
    team1_pos = features[0, 4:14].reshape(-1, 2).numpy()
    team2_pos = features[0, 14:24].reshape(-1, 2).numpy()
    
    # Plot each map
    plots = [
        ('Team 1 Influence', maps['team1_influence'][0], team1_pos, 'red'),
        ('Team 2 Influence', maps['team2_influence'][0], team2_pos, 'blue'),
        ('Ball Influence', maps['current_ball_influence'][0], ball_pos.reshape(1, 2), 'white'),
        ('Team 1 Possession', maps['team1_possession'][0], None, 'red'),
        ('Team 2 Possession', maps['team2_possession'][0], None, 'blue'),
        ('Combined View', None, None, None)
    ]
    
    for (title, data, positions, color), ax in zip(plots, axes.flat):
        if title == 'Combined View':
            # Create combined view
            combined = (maps['team1_possession'][0] - maps['team2_possession'][0]).numpy()
            im = ax.imshow(combined, cmap='RdBu', vmin=-1, vmax=1)
            plt.colorbar(im, ax=ax)
        else:
            # Plot influence map
            if data is not None:
                im = ax.imshow(data.numpy(), cmap='viridis')
                plt.colorbar(im, ax=ax)
            
            # Plot positions if provided
            if positions is not None:
                ax.scatter(positions[:, 0] * maps['team1_influence'][0].shape[1] / 100,
                          positions[:, 1] * maps['team1_influence'][0].shape[0] / 60,
                          c=color, s=50)
        
        # Draw field markings
        ax.axvline(x=maps['team1_influence'][0].shape[1]/2, color='white', linestyle='--', alpha=0.5)
        ax.set_title(title)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    if show:
        plt.show()
    else:
        plt.close()

def main():
    # Load the trained model
    checkpoint_path = "outputs/spatial_influence/model_best.pt"
    device = torch.device("cpu")  # CPU is fine for visualization
    
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
    model = ModelRegistry.get_model('spatial_influence')
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    # Example scenarios to visualize
    scenarios = [
        {
            'name': 'attacking_play',
            'ball_pos': (70, 30),
            'ball_vel': (10, 0),
            'team1_positions': [
                (65, 30), (55, 20), (55, 40), (45, 15), (45, 45)
            ],
            'team2_positions': [
                (85, 30), (75, 20), (75, 40), (65, 15), (65, 45)
            ]
        },
        {
            'name': 'midfield_battle',
            'ball_pos': (50, 30),
            'ball_vel': (0, 0),
            'team1_positions': [
                (55, 30), (45, 25), (45, 35), (35, 20), (35, 40)
            ],
            'team2_positions': [
                (45, 30), (55, 25), (55, 35), (65, 20), (65, 40)
            ]
        },
        # Add more scenarios as needed
    ]
    
    # Create output directory
    output_dir = Path("outputs/spatial_influence/visualizations")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate visualizations for each scenario
    for scenario in scenarios:
        features = create_example_positions(
            ball_pos=scenario['ball_pos'],
            ball_vel=scenario['ball_vel'],
            team1_positions=scenario['team1_positions'],
            team2_positions=scenario['team2_positions']
        )
        
        save_path = output_dir / f"influence_maps_{scenario['name']}.png"
        plot_influence_maps(model, features, save_path=save_path, show=False)
        print(f"Saved visualization for {scenario['name']} to {save_path}")

if __name__ == "__main__":
    main() 