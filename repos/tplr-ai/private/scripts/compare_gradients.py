#!/usr/bin/env python3
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load env before imports
def load_env():
    env_path = Path(__file__).parent.parent / ".env"
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        sys.exit(1)
    load_dotenv(env_path, override=True)

load_env()

import io
import asyncio
import argparse
import numpy as np
import torch
import aioboto3
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from rich import print
from rich.table import Table
from rich.console import Console
from concurrent.futures import ProcessPoolExecutor
from typing import Dict, Any, List, Tuple
import multiprocessing as mp
import tplr

# Import UIDGradientAnalyzer from analyze_single_gradient
from analyze_single_gradient import UIDGradientAnalyzer

class GradientComparator:
    def __init__(self, uid1: str, uid2: str, device: str = "cuda"):
        self.uid1 = str(uid1)
        self.uid2 = str(uid2)
        self.device = device
        self.setup_clients()
        
    def setup_clients(self):
        """Initialize S3 clients"""
        self.session = aioboto3.Session()
        self.endpoint_url = f"https://{os.getenv('R2_GRADIENTS_ACCOUNT_ID')}.r2.cloudflarestorage.com"
        self.aws_access_key_id = os.getenv('R2_GRADIENTS_READ_ACCESS_KEY_ID')
        self.aws_secret_access_key = os.getenv('R2_GRADIENTS_READ_SECRET_ACCESS_KEY')
        self.bucket_name = os.getenv('R2_GRADIENTS_BUCKET_NAME')

    async def get_gradient_data(self, uid: str) -> Dict[str, Any]:
        """Load gradient analysis data for a given UID"""
        file_path = Path(f'gradient_analysis/uid_{uid}_analysis.json')
        
        if not file_path.exists():
            print(f"[yellow]Analysis file not found for UID {uid}. Downloading and analyzing...[/yellow]")
            analyzer = UIDGradientAnalyzer(
                int(uid),
                self.device,
                batch_size=50,
                max_workers=8
            )
            await analyzer.analyze()
        
        with open(file_path) as f:
            return json.load(f)

    def compute_layer_stats(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Compute average statistics across all windows for each layer."""
        all_stats = []
        
        for window, window_data in data['statistics_per_window'].items():
            for layer, stats in window_data['layer_stats'].items():
                # Create a clean stats dict with only numeric values
                clean_stats = {
                    'avg_norm': float(stats['avg_norm']),
                    'avg_sparsity': float(stats['avg_sparsity']),
                    'avg_std': float(stats['avg_std']),
                    'window': int(window),
                    'layer': layer
                }
                all_stats.append(clean_stats)
        
        if not all_stats:
            return pd.DataFrame()
        
        try:
            df = pd.DataFrame(all_stats)
            # Only aggregate numeric columns
            numeric_cols = ['avg_norm', 'avg_sparsity', 'avg_std']
            return df.groupby('layer')[numeric_cols].mean()
        except Exception as e:
            print(f"[yellow]Warning: Error in computing stats: {str(e)}[/yellow]")
            print("[yellow]Falling back to simplified analysis...[/yellow]")
            # Fallback to simpler analysis if aggregation fails
            simplified_stats = {}
            for stats in all_stats:
                layer = stats['layer']
                if layer not in simplified_stats:
                    simplified_stats[layer] = {
                        'avg_norm': [],
                        'avg_sparsity': [],
                        'avg_std': []
                    }
                simplified_stats[layer]['avg_norm'].append(stats['avg_norm'])
                simplified_stats[layer]['avg_sparsity'].append(stats['avg_sparsity'])
                simplified_stats[layer]['avg_std'].append(stats['avg_std'])
            
            # Convert to DataFrame
            rows = []
            for layer, stats in simplified_stats.items():
                rows.append({
                    'layer': layer,
                    'avg_norm': np.mean(stats['avg_norm']),
                    'avg_sparsity': np.mean(stats['avg_sparsity']),
                    'avg_std': np.mean(stats['avg_std'])
                })
            
            df = pd.DataFrame(rows)
            return df.set_index('layer')

    async def plot_temporal_analysis(self, data1: Dict, data2: Dict, common_windows: List[int]):
        """Generate temporal analysis plots."""
        plot_dir = Path('gradient_analysis/plots')
        plot_dir.mkdir(exist_ok=True)
        
        # Prepare data for parallel processing
        args_list = [(data1, data2, window) for window in sorted(common_windows)]
        
        # Parallel processing of windows
        with ProcessPoolExecutor(max_workers=mp.cpu_count()) as executor:
            window_analyses = list(executor.map(analyze_window_parallel, args_list))
        
        # Generate plots and return temporal data
        return generate_plots(window_analyses, self.uid1, self.uid2, plot_dir)

    async def compare(self):
        """Compare gradient statistics between two UIDs."""
        console = Console()
        
        # Load data
        data1 = await self.get_gradient_data(self.uid1)
        data2 = await self.get_gradient_data(self.uid2)

        # Basic info comparison
        print(f"\n[bold cyan]Basic Information Comparison[/bold cyan]")
        print(f"UID {self.uid1}: {data1['total_windows']} windows, {data1['total_gradients']} gradients")
        print(f"UID {self.uid2}: {data2['total_windows']} windows, {data2['total_gradients']} gradients")

        # Compute average stats for each layer
        stats1 = self.compute_layer_stats(data1)
        stats2 = self.compute_layer_stats(data2)

        # Create and display comparison table
        display_comparison_table(stats1, stats2, self.uid1, self.uid2, console)

        # Compare gradient evolution
        common_windows = set(data1['windows']) & set(data2['windows'])
        if common_windows:
            print(f"\nFound {len(common_windows)} common windows for comparison")
            print("\n[bold cyan]Generating temporal analysis plots...[/bold cyan]")
            
            temporal_data = await self.plot_temporal_analysis(data1, data2, list(common_windows))
            
            # Print insights
            print_temporal_insights(temporal_data, common_windows)
            
            print(f"\n[green]Plots saved in gradient_analysis/plots/[/green]")

def analyze_window_parallel(args: Tuple[Dict, Dict, int]) -> Dict:
    """Analyze a single window's gradients in parallel."""
    data1, data2, window = args
    
    window_stats = {
        'window': window,
        'layers': {}
    }
    
    # Get stats for this window from both UIDs
    stats1 = data1['statistics_per_window'].get(str(window), {}).get('layer_stats', {})
    stats2 = data2['statistics_per_window'].get(str(window), {}).get('layer_stats', {})
    
    for layer in stats1.keys():
        if layer in stats2:
            window_stats['layers'][layer] = {
                'norm_diff': abs(stats1[layer]['avg_norm'] - stats2[layer]['avg_norm']),
                'sparsity_diff': abs(stats1[layer]['avg_sparsity'] - stats2[layer]['avg_sparsity']),
                'std_diff': abs(stats1[layer]['avg_std'] - stats2[layer]['avg_std']),
                'norm1': stats1[layer]['avg_norm'],
                'norm2': stats2[layer]['avg_norm']
            }
    
    return window_stats

def generate_plots(window_analyses: List[Dict], uid1: str, uid2: str, plot_dir: Path) -> Dict:
    """Generate all comparison plots."""
    # Organize data for plotting
    temporal_data = {
        'windows': [],
        'layers': {},
        'norm_diffs': [],
        'sparsity_diffs': [],
        'std_diffs': []
    }
    
    for analysis in window_analyses:
        window = analysis['window']
        temporal_data['windows'].append(window)
        
        for layer, stats in analysis['layers'].items():
            if layer not in temporal_data['layers']:
                temporal_data['layers'][layer] = {
                    'norm_diffs': [],
                    'norms1': [],
                    'norms2': []
                }
            
            temporal_data['layers'][layer]['norm_diffs'].append(stats['norm_diff'])
            temporal_data['layers'][layer]['norms1'].append(stats['norm1'])
            temporal_data['layers'][layer]['norms2'].append(stats['norm2'])
    
    # Plot 1: Overall gradient evolution
    plt.figure(figsize=(15, 10))
    for layer in list(temporal_data['layers'].keys())[:5]:  # Plot top 5 layers for clarity
        plt.plot(temporal_data['windows'], 
                temporal_data['layers'][layer]['norm_diffs'], 
                label=layer.split('.')[-2:])
    
    plt.title(f'Gradient Norm Differences Evolution (UID {uid1} vs {uid2})')
    plt.xlabel('Window')
    plt.ylabel('Gradient Norm Difference')
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(plot_dir / f'temporal_analysis_{uid1}_vs_{uid2}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Plot 2: Heatmap of layer differences
    plt.figure(figsize=(20, 10))
    heatmap_data = []
    layer_names = []
    
    for layer in temporal_data['layers']:
        heatmap_data.append(temporal_data['layers'][layer]['norm_diffs'])
        layer_names.append(layer.split('.')[-2:])
    
    sns.heatmap(heatmap_data, 
                xticklabels=temporal_data['windows'],
                yticklabels=layer_names,
                cmap='RdYlBu_r',
                center=0)
    
    plt.title(f'Layer-wise Gradient Differences Heatmap (UID {uid1} vs {uid2})')
    plt.xlabel('Window')
    plt.ylabel('Layer')
    plt.tight_layout()
    plt.savefig(plot_dir / f'heatmap_{uid1}_vs_{uid2}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Plot 3: Comparative gradient norms
    plt.figure(figsize=(15, 10))
    for layer in list(temporal_data['layers'].keys())[:5]:
        plt.plot(temporal_data['windows'], 
                temporal_data['layers'][layer]['norms1'], 
                label=f'{layer.split(".")[-2:]} (UID {uid1})',
                linestyle='-')
        plt.plot(temporal_data['windows'], 
                temporal_data['layers'][layer]['norms2'], 
                label=f'{layer.split(".")[-2:]} (UID {uid2})',
                linestyle='--')
    
    plt.title(f'Comparative Gradient Norms Evolution (UID {uid1} vs {uid2})')
    plt.xlabel('Window')
    plt.ylabel('Gradient Norm')
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(plot_dir / f'comparative_norms_{uid1}_vs_{uid2}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return temporal_data

def display_comparison_table(stats1: pd.DataFrame, stats2: pd.DataFrame, uid1: str, uid2: str, console: Console):
    """Display comparison table with rich formatting."""
    # Create comparison table
    table = Table(title="Layer-wise Gradient Comparison")
    table.add_column("Layer", style="cyan")
    table.add_column("Metric", style="magenta")
    table.add_column(f"UID {uid1}", justify="right")
    table.add_column(f"UID {uid2}", justify="right")
    table.add_column("Diff %", justify="right")

    # Compare important metrics
    metrics = ['avg_norm', 'avg_sparsity', 'avg_std']
    
    # Get common layers
    common_layers = set(stats1.index) & set(stats2.index)
    
    if not common_layers:
        console.print("[yellow]Warning: No common layers found between UIDs[/yellow]")
        return
    
    for layer in common_layers:
        for metric in metrics:
            try:
                val1 = stats1.loc[layer, metric]
                val2 = stats2.loc[layer, metric]
                
                # Handle zero values
                if val1 == 0 and val2 == 0:
                    diff_pct = 0
                elif val1 == 0:
                    diff_pct = float('inf')
                else:
                    diff_pct = ((val2 - val1) / val1 * 100)
                
                # Format values for display
                val1_str = f"{val1:.2e}"
                val2_str = f"{val2:.2e}"
                diff_str = f"{diff_pct:+.2f}%" if diff_pct != float('inf') else "∞%"
                
                # Color code the difference
                if abs(diff_pct) > 50:
                    diff_str = f"[red]{diff_str}[/red]"
                elif abs(diff_pct) > 20:
                    diff_str = f"[yellow]{diff_str}[/yellow]"
                else:
                    diff_str = f"[green]{diff_str}[/green]"

                table.add_row(
                    layer if metric == 'avg_norm' else "",
                    metric,
                    val1_str,
                    val2_str,
                    diff_str
                )
            except Exception as e:
                print(f"[yellow]Warning: Error processing {layer} {metric}: {str(e)}[/yellow]")
                continue
                
        table.add_row("", "", "", "", "")  # Add separator between layers

    console.print(table)

def print_temporal_insights(temporal_data: Dict, common_windows: List[int]):
    """Print insights from temporal analysis."""
    # Find windows with largest differences
    max_diff_windows = []
    for layer in temporal_data['layers']:
        norm_diffs = temporal_data['layers'][layer]['norm_diffs']
        max_diff_idx = np.argmax(norm_diffs)
        max_diff_windows.append((
            layer,
            list(common_windows)[max_diff_idx],
            norm_diffs[max_diff_idx]
        ))
    
    # Sort and print top 5 largest differences
    max_diff_windows.sort(key=lambda x: x[2], reverse=True)
    for layer, window, diff in max_diff_windows[:5]:
        print(f"[yellow]• Largest difference in {layer}: window {window} (diff: {diff:.2e})[/yellow]")

def main():
    parser = argparse.ArgumentParser(description="Compare gradients between two UIDs")
    parser.add_argument("uid1", type=int, help="First UID to compare")
    parser.add_argument("uid2", type=int, help="Second UID to compare")
    parser.add_argument("--device", type=str, default="cuda", help="Device to use for computations")
    args = parser.parse_args()
    
    try:
        comparator = GradientComparator(args.uid1, args.uid2, args.device)
        asyncio.run(comparator.compare())
    except Exception as e:
        print(f"[red]Error: {str(e)}[/red]")
        sys.exit(1)

if __name__ == "__main__":
    main()
