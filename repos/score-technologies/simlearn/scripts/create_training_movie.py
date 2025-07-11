import imageio.v3 as imageio
import glob
import os
from pathlib import Path
import argparse
import numpy as np
from PIL import Image

def create_training_movie(model_type, fps=2):
    """Create a movie from training evolution plots."""
    # Get the plot directory
    plot_dir = Path('outputs') / model_type / 'training_evolution'
    if not plot_dir.exists():
        print(f"Error: Directory {plot_dir} does not exist.")
        print("Have you run the training with epoch plots enabled?")
        print(f"Try running: ./scripts/{model_type}_model.sh first")
        return
    
    # Get all png files and sort them by epoch number
    plot_files = sorted(
        plot_dir.glob('epoch_*.png'),
        key=lambda x: int(x.stem.split('_')[1])
    )
    
    if not plot_files:
        print(f"Error: No epoch plots found in {plot_dir}")
        print("Make sure training completed successfully and generated epoch plots")
        return
    
    print(f"Found {len(plot_files)} plots")
    
    # Create output directory if it doesn't exist
    movie_dir = Path('outputs') / model_type / 'movies'
    movie_dir.mkdir(exist_ok=True, parents=True)
    
    # Set a reasonable target size
    max_width, max_height = 1280, 960

    # Read all images and resize to the target size
    print("Reading images...")
    images = []
    for plot_file in plot_files:
        with Image.open(plot_file) as img:
            w, h = img.size
            scale = min(max_width / w, max_height / h, 1.0)
            new_size = (int(w * scale), int(h * scale))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            padded_img = Image.new("RGBA", (max_width, max_height), (255, 255, 255, 0))
            padded_img.paste(img, ((max_width - new_size[0]) // 2, (max_height - new_size[1]) // 2))
            images.append(np.array(padded_img))
    
    # Add pause at the end by repeating last frame
    last_frame = images[-1]
    for _ in range(fps * 2):  # 2 second pause at the end
        images.append(last_frame)
    
    # Save as MP4
    output_path = movie_dir / 'training_evolution.mp4'
    print(f"Creating movie at {output_path}...")
    
    imageio.imwrite(
        output_path,
        images,
        fps=fps,
        codec='h264',
        quality=8,
        macro_block_size=1  # This avoids the resizing warning
    )
    
    print(f"Done! Movie saved to {output_path}")

def main():
    parser = argparse.ArgumentParser(description='Create training evolution movie')
    parser.add_argument('--model-type', type=str, required=True,
                      choices=['simple', 'full', 'ball_anticipation'],
                      help='Type of model (simple, full, or ball_anticipation)')
    parser.add_argument('--fps', type=int, default=4,
                      help='Frames per second in output video')
    
    args = parser.parse_args()
    create_training_movie(args.model_type, args.fps)

if __name__ == '__main__':
    main() 