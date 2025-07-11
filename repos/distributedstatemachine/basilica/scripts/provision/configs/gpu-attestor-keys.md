# GPU-Attestor Cryptographic Key Management Guide

This guide explains how to generate and manage the P256 ECDSA keys required for building the GPU-attestor binary with embedded validator verification keys.

## 🔐 Overview

The GPU-attestor uses **embedded cryptographic keys** for hardware attestation verification:

- **Validator Private Key**: Used by validators to verify attestation signatures (kept secret)
- **Validator Public Key**: Embedded in GPU-attestor binary at build time (can be shared)
- **Hardware Signatures**: Generated by GPU-attestor using embedded public key for verification

## 🚀 Quick Start

### 1. Generate Validator Key Pair

```bash
# Navigate to project root
cd /path/to/basilica

# Generate new P256 ECDSA key pair
./scripts/gen-key.sh

# Output files created:
# - private_key.pem (KEEP SECRET - validator verification key)
# - public_key.pem  (standard PEM format)
# - public_key.hex  (compressed format for embedding)
```

### 2. Build GPU-Attestor with Embedded Key

```bash
# Method 1: Automatic key detection
./scripts/gpu-attestor/build.sh

# Method 2: Explicit key specification
./scripts/gpu-attestor/build.sh --key $(cat public_key.hex)

# Method 3: Using environment variable
export VALIDATOR_PUBLIC_KEY=$(cat public_key.hex)
cargo build --release -p gpu-attestor
```

### 3. Deploy GPU-Attestor Binary

```bash
# Deploy to executor machines via provisioning system
./scripts/basilica.sh deploy production

# Or manual deployment
scp gpu-attestor root@executor-ip:/opt/basilica/bin/
```

## 📋 Detailed Process

### Step 1: Key Generation

The key generation process creates a P256 ECDSA key pair:

```bash
./scripts/gen-key.sh
```

**What happens:**
1. **Private Key Generation**: Creates a new P256 private key using OpenSSL
2. **Public Key Extraction**: Derives public key in both PEM and compressed hex formats
3. **File Creation**: Writes three files with appropriate permissions
4. **Output Display**: Shows the compressed hex key for embedding

**Generated Files:**
```
private_key.pem    # Validator's signing key (600 permissions)
public_key.pem     # Standard PEM public key (644 permissions)  
public_key.hex     # Compressed hex for embedding (644 permissions)
```

### Step 2: Binary Building with Key Embedding

The GPU-attestor binary embeds the validator's public key at compile time:

#### Build Process Flow:
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Source    │───►│   Build     │───►│  Embedded   │───►│   Binary    │
│    Code     │    │   Script    │    │    Key      │    │   Output    │
│             │    │             │    │             │    │             │
│ • Rust code │    │ • Detect/   │    │ • Validate  │    │ • gpu-      │
│ • build.rs  │    │   validate  │    │   format    │    │   attestor  │
│ • P256 sig  │    │   key       │    │ • Generate  │    │ • Embedded  │
│   verification│   │ • Set env   │    │   Rust code │    │   public    │
│             │    │   vars      │    │ • Compile   │    │   key       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### Key Detection Order:
The build script automatically detects keys in this priority order:

1. **Command line argument**: `--key <hex_key>`
2. **Environment variable**: `VALIDATOR_PUBLIC_KEY`
3. **private_key.pem**: Extract public key automatically
4. **public_key.hex**: Use directly
5. **public_key.pem**: Convert to compressed format

#### Key Validation:
- **Format**: Must be exactly 66 hexadecimal characters
- **Length**: Must decode to exactly 33 bytes (compressed P256 public key)
- **Prefix**: Must start with `02` or `03` (compression flag)

### Step 3: Integration with Provisioning System

The provisioning system handles key management automatically:

#### In Configuration Generation:
```bash
# Generate configurations with key management
./scripts/basilica.sh provision configure

# Keys are automatically:
# 1. Generated if missing
# 2. Validated for format
# 3. Added to secrets.toml
# 4. Used for GPU-attestor builds
```

#### In Service Deployment:
```bash
# Deploy with automatic key handling
./scripts/basilica.sh deploy production

# Process includes:
# 1. Key validation
# 2. GPU-attestor binary building with embedded key
# 3. Binary deployment to executor machines
# 4. Validator private key secure storage
```

## 🔧 Manual Operations

### Generate Keys for Specific Environment

```bash
# Development environment
./scripts/gen-key.sh
mv private_key.pem keys/dev_validator_private.pem
mv public_key.hex keys/dev_validator_public.hex

# Production environment  
./scripts/gen-key.sh
mv private_key.pem keys/prod_validator_private.pem
mv public_key.hex keys/prod_validator_public.hex
```

### Build GPU-Attestor for Multiple Environments

```bash
# Development build
export VALIDATOR_PUBLIC_KEY=$(cat keys/dev_validator_public.hex)
cargo build --release -p gpu-attestor
mv target/release/gpu-attestor binaries/gpu-attestor-dev

# Production build
export VALIDATOR_PUBLIC_KEY=$(cat keys/prod_validator_public.hex)
cargo build --release -p gpu-attestor
mv target/release/gpu-attestor binaries/gpu-attestor-prod
```

### Verify Embedded Key

```bash
# Extract embedded key from binary (if debug symbols available)
strings gpu-attestor | grep -E '^0[23][0-9a-fA-F]{64}$'

# Or check using the binary itself
./gpu-attestor --verify-key $(cat public_key.hex)
```

## 🔒 Security Best Practices

### Key Storage

1. **Private Keys** (validator signing keys):
   - Store in secure location with 600 permissions
   - Never commit to version control
   - Use hardware security modules in production
   - Implement key rotation procedures

2. **Public Keys** (for embedding):
   - Can be stored in version control
   - Should be backed up securely
   - Version control changes for audit trail

### Production Key Management

```bash
# Secure key generation on air-gapped machine
./scripts/gen-key.sh

# Secure private key storage
mkdir -p /etc/basilica/keys
cp private_key.pem /etc/basilica/keys/validator_private.pem
chmod 600 /etc/basilica/keys/validator_private.pem
chown basilica:basilica /etc/basilica/keys/validator_private.pem

# Public key for embedding (can be distributed)
cp public_key.hex scripts/provision/configs/validator_public.hex
```

### Key Rotation Procedure

1. **Generate new key pair**:
   ```bash
   ./scripts/gen-key.sh
   ```

2. **Update secrets configuration**:
   ```bash
   # Add new public key to configuration
   echo "new_validator_public_key = \"$(cat public_key.hex)\"" >> scripts/provision/configs/secrets.toml
   ```

3. **Rebuild GPU-attestor binaries**:
   ```bash
   export VALIDATOR_PUBLIC_KEY=$(cat public_key.hex)
   ./scripts/gpu-attestor/build.sh
   ```

4. **Deploy updated binaries**:
   ```bash
   ./scripts/basilica.sh deploy production
   ```

5. **Update validator private key**:
   ```bash
   # Securely update validator's private key
   # (coordinate timing to avoid verification failures)
   ```

## 🧪 Testing and Validation

### Validate Key Generation

```bash
# Test key generation
./scripts/gen-key.sh

# Verify files created
ls -la private_key.pem public_key.pem public_key.hex

# Validate key format
echo "Public key length: $(cat public_key.hex | wc -c) chars (should be 66)"
echo "Key starts with: $(cat public_key.hex | head -c 2) (should be 02 or 03)"

# Test key pair cryptographic validity
echo "test message" | openssl dgst -sha256 -sign private_key.pem | \
openssl dgst -sha256 -verify public_key.pem -signature -
```

### Validate GPU-Attestor Build

```bash
# Build with test key
export VALIDATOR_PUBLIC_KEY=$(cat public_key.hex)
cargo build --release -p gpu-attestor

# Verify binary was created
ls -la target/release/gpu-attestor

# Test binary execution (requires GPU)
./target/release/gpu-attestor --help
```

### Test End-to-End Attestation

```bash
# Generate attestation
./target/release/gpu-attestor --output test_attestation.json

# Verify signature using validator's private key
# (This would be done by the validator service)
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "VALIDATOR_PUBLIC_KEY not set"
```bash
# Solution: Generate or specify key
./scripts/gen-key.sh
export VALIDATOR_PUBLIC_KEY=$(cat public_key.hex)
```

#### 2. "Invalid key format" 
```bash
# Check key length and format
echo "Key: $(cat public_key.hex)"
echo "Length: $(cat public_key.hex | wc -c) (should be 66)"

# Regenerate if invalid
rm -f *.pem *.hex
./scripts/gen-key.sh
```

#### 3. "Build failed: embedded_keys.rs not found"
```bash
# Clean and rebuild
cargo clean
export VALIDATOR_PUBLIC_KEY=$(cat public_key.hex)
cargo build --release -p gpu-attestor
```

#### 4. OpenSSL linking errors
```bash
# Install required OpenSSL development packages
sudo apt-get install libssl-dev pkg-config

# Or use Docker build
./scripts/gpu-attestor/build.sh --no-extract
```

### Debug Information

```bash
# Show detailed build information
RUST_LOG=debug cargo build --release -p gpu-attestor

# Check embedded key in build output
cat target/release/build/gpu-attestor-*/out/embedded_keys.rs

# Verify environment variables
echo "VALIDATOR_PUBLIC_KEY: $VALIDATOR_PUBLIC_KEY"
env | grep VALIDATOR
```

## 📚 Integration Examples

### With Provisioning System

The provisioning system handles key management automatically:

```bash
# Complete workflow with automatic key handling
./scripts/basilica.sh provision all

# Manual key override
export VALIDATOR_PUBLIC_KEY="0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
./scripts/basilica.sh deploy production
```

### With Docker Build

```bash
# Build GPU-attestor Docker image with embedded key
docker build \
  --build-arg VALIDATOR_PUBLIC_KEY="$(cat public_key.hex)" \
  -f scripts/gpu-attestor/Dockerfile \
  -t basilica/gpu-attestor:latest \
  .
```

### With CI/CD Pipeline

```yaml
# Example GitHub Actions integration
- name: Generate validator keys
  run: ./scripts/gen-key.sh

- name: Build GPU-attestor
  env:
    VALIDATOR_PUBLIC_KEY: ${{ secrets.VALIDATOR_PUBLIC_KEY }}
  run: cargo build --release -p gpu-attestor

- name: Test attestation
  run: ./target/release/gpu-attestor --help
```

This comprehensive guide covers all aspects of GPU-attestor key management, from generation through deployment and production operations.