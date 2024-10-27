# Disclaimer: we thought of dockerizing it to make deployment easier but the docker image turned out to be too big. 
# Instructions:
# Download rustup-init.exe from https://rustup.rs
# Run the installer and choose option 1 for default installation

# Verify installation
rustup default stable
rustup update
rustc --version
cargo --version

# Add Rust to PATH if not already added
# Add to System Environment Variables:
# %USERPROFILE%\.cargo\bin (usually gets added by default)
```

# Install Visual Studio Build Tools (around 6GB)
```powershell
# Download Visual Studio Build Tools 2019 or later
# https://visualstudio.microsoft.com/visual-studio-components/
# During installation, select:
# - Desktop development with C++
# - Windows 10 SDK
# - MSVC v142 build tools or later
# - C++ CMake tools for Windows
```

### Install LLVM (2GB for Windows after extraction) 
```powershell
# Download LLVM from https://releases.llvm.org/download.html
# Run installer and select:
# - Add LLVM to the system PATH
```

###  Install Node.js Dependencies

# Create a new directory for your project
mkdir exonum-private-blockchain
cd exonum-private-blockchain

# Initialize Node.js project
npm init -y

# Install required dependencies
npm install express@latest exonum-client@latest crypto@latest dotenv@latest

# We will be running 4 nodes as a proof of concept.

# On Bootstrap Node (Node 1)
exonum-cli generate-config --output-dir ./config node-1 --validators-count 4
```

```powershell
# On Node 2
exonum-cli generate-config --output-dir ./config node-2 --validators-count 4
```

```powershell
# On Node 3
exonum-cli generate-config --output-dir ./config node-3 --validators-count 4
```

```powershell
# On Node 4
exonum-cli generate-config --output-dir ./config node-4 --validators-count 4
```

## Run these commands on each respective node:

```powershell
# On Bootstrap Node (Node 1)
exonum-cli generate-config --output-dir ./config node-1 --validators-count 4
```

```powershell
# On Node 2
exonum-cli generate-config --output-dir ./config node-2 --validators-count 4
```

```powershell
# On Node 3
exonum-cli generate-config --output-dir ./config node-3 --validators-count 4
```

```powershell
# On Node 4
exonum-cli generate-config --output-dir ./config node-4 --validators-count 4

### To be added to node-x.toml where x is the node no.
Replace the following in each node's config file (config/node-X.toml):

```toml
[
common
]
database_path = "./db"
node_public_key = "NODE_X_PUBLIC_KEY"

[
network
]
listen_address = "0.0.0.0:6333"

[
api
]
public_api_address = "0.0.0.0:820X"  # X is node number
private_api_address = "0.0.0.0:809X" # X is node number

[
mempool
]
pool_size = 100000

[
consensus
]
first_round_timeout = 3000
status_timeout = 5000
peers_timeout = 10000
txs_block_limit = 1000
min_propose_timeout = 10
max_propose_timeout = 200
propose_timeout_threshold = 500

```
### Bootstrap Node Setup
```powershell
# Initialize the network
exonum-cli finalize --public-api-address 0.0.0.0:8200 --private-api-address 0.0.0.0:8091 config/node-1.toml

# Start the node
exonum-cli run --node-config config/node-1.toml --db-path ./db --public-api-address 0.0.0.0:8200 --private-api-address 0.0.0.0:8091
```
### Additional Nodes Setup (Run on each node)
```powershell
# Replace X with node number (2,3,4)
exonum-cli finalize --public-api-address 0.0.0.0:820X --private-api-address 0.0.0.0:809X config/node-X.toml

exonum-cli run --node-config config/node-X.toml --db-path ./db --public-api-address 0.0.0.0:820X --private-api-address 0.0.0.0:809X
```

### Windows Firewall Configuration (Run on each node)
```powershell
# Open P2P port
netsh advfirewall firewall add rule name="Exonum P2P" dir=in action=allow protocol=TCP localport=6333

# Open Public API port (adjust port number for each node)
netsh advfirewall firewall add rule name="Exonum Public API" dir=in action=allow protocol=TCP localport=8200

# Open Private API port (adjust port number for each node)
netsh advfirewall firewall add rule name="Exonum Private API" dir=in action=allow protocol=TCP localport=8091

# Allow outbound connections
netsh advfirewall firewall add rule name="Exonum Outbound" dir=out action=allow protocol=TCP localport=any

```
### Can also be done on widows firewall advanced settings.

### Start Node.js Server (Run on each node)
```powershell
# Start the Node.js server
node server.js
```
## Optional:
On each node, verify connection to bootstrap node
curl http://BOOTSTRAP_NODE_IP:8200/api/system/v

## Example .env file:
```.env
NODE_PORT=3010
EXONUM_PUBLIC_PORT=8200
EXONUM_PRIVATE_PORT=8091
P2P_PORT=6333
NODE_IP=0.0.0.0
BOOTSTRAP_NODE_IP=192.168.1.100 #set it to ur node's ip
```