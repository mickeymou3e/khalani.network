# submit-signed-extrinsic

Submits a hex-encoded Substrate signed extrinsic stored in a file path to the specified node URL.

## Setup

### 1. Create and Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## Usage

```bash
python main.py <node_url> <extrinsic_file>
```

### Example

```bash
python main.py http://localhost:9946 extrinsic.txt
```

Where extrinsic.txt contains the hex-encoded signed extrinsic.

