import torch
import numpy as np
import matplotlib.pyplot as plt
from simlearn.approaches.models.registry import ModelRegistry
from simlearn.utils.preprocessing import SoccerScaler
import seaborn as sns
import os

def create_field_plot(model, device, model_type='full', resolution=50, save_path=None):
    """Create a contour plot of model predictions across the field."""
    model.eval()
    scaler = SoccerScaler()
    
    # Create mesh grid of ball positions
    x = np.linspace(0, 100, resolution)
    y = np.linspace(0, 60, resolution)
    X, Y = np.meshgrid(x, y)
    
    # Prepare input features
    predictions = np.zeros_like(X)
    
    # Create a base feature vector with average/neutral values
    base_features = torch.zeros(24)  # Total feature count
    
    # Set some neutral positions for other features (we won't plot these)
    # This represents a fairly neutral game state where players are reasonably positioned
    for i in range(5):  # Team 1
        base_features[4 + i*2] = 40  # x positions around middle-left
        base_features[4 + i*2 + 1] = 30  # y positions around middle
    
    for i in range(5):  # Team 2
        base_features[14 + i*2] = 60  # x positions around middle-right
        base_features[14 + i*2 + 1] = 30  # y positions around middle
    
    # Evaluate model predictions across the field
    with torch.no_grad():
        for i in range(resolution):
            for j in range(resolution):
                features = base_features.clone()
                features[0] = X[i, j]  # ball_x
                features[1] = Y[i, j]  # ball_y
                
                # Scale features
                features = scaler.scale_features(features.unsqueeze(0))
                features = features.to(device)
                
                # Get prediction
                output = model(features)
                predictions[i, j] = output.cpu().item()
    
    # Create the plot
    plt.figure(figsize=(12, 8))
    
    # Plot the field boundaries
    plt.plot([0, 0, 100, 100, 0], [0, 60, 60, 0, 0], 'k-', linewidth=2)
    plt.plot([50, 50], [0, 60], 'k--', alpha=0.5)  # Halfway line
    
    # Create contour plot
    contour = plt.contourf(X, Y, predictions, levels=20, cmap='RdYlBu', alpha=0.8)
    plt.colorbar(contour, label='Predicted Outcome')
    
    plt.title(f'Predicted Outcome by Ball Position\n{model_type.capitalize()} Model - {os.path.basename(save_path)}')
    plt.xlabel('Field Position X')
    plt.ylabel('Field Position Y')
    plt.axis('equal')
    
    # Save the plot
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    else:
        plt.savefig(f'outputs/{model_type}_model_predictions.png', dpi=300, bbox_inches='tight')
    plt.close()

def main():
    device = (
        torch.device("mps") if torch.backends.mps.is_available()
        else torch.device("cuda") if torch.cuda.is_available()
        else torch.device("cpu")
    )
    
    for model_type in ModelRegistry.available_models():
        model_dir = f'outputs/{model_type}'
        plots_dir = os.path.join(model_dir, 'training_evolution')
        
        if os.path.exists(plots_dir):
            print(f"\nFound training evolution plots for {model_type} in {plots_dir}")
            plot_files = sorted([f for f in os.listdir(plots_dir) if f.endswith('.png')])
            print(f"Number of evolution plots: {len(plot_files)}")
        
        # Try to create current prediction if model exists
        checkpoint_path = os.path.join(model_dir, 'model_best.pt')
        try:
            checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
            model = ModelRegistry.get_model(model_type)
            model.load_state_dict(checkpoint['model_state_dict'])
            model = model.to(device)
            
            print(f"Creating current prediction visualization...")
            create_field_plot(model, device, model_type)
            print(f"Saved current prediction plot to outputs/{model_type}/predictions.png")
            
        except FileNotFoundError:
            print(f"\nNo checkpoint found for {model_type} model at {checkpoint_path}")

if __name__ == "__main__":
    main() 