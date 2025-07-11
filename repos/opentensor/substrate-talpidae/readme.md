# Substrate Talpidae

![A Cute Talpidae](assets/talpidae.webp)

A tool for inspecting Substrate state.

## Installation

Create and activate a Conda environment:

```bash
conda env create --file environment.yml
conda activate substrate-talpidae
```

## Usage

Modify the node uri and `BLOCK` in `main.py` and run:

```bash
python main.py
```

The first run may take some time.

Future runs are faster due to remote requests getting cached.

## Future improvements

- Customise with cli arguments.
- Chart Substrate state over time.
- Chart which keys are most responsible for archive node disk usage growth.
