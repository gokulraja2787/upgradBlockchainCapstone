# upgradBlockchainCapstone
repository to hold my capstone project of Upgrad course on blockchain

# Reliance network
Hyperledger Fabric blockchain system for reliance-network.com

## Fabric Setup
- 5 Organizations:
    - Reliance Infrastructure
    - Reliance Power
    - Reliance Communications
    - Reliance Entertainment
    - Reliance Capital
- 2 Peers per organization
- TLS Enabled
- Both organization can endorse
- The setupFabric.sh sets up the fabric network

### Docker compose file Generation
Docker compose file is docker-compose-cli.yaml will not committed. It is template. The template will be generated automatically by setupFabric.sh. This approach of generating docker-compose-cli.yaml is taken because, the certificate file names has to be replaced because ca is enabled.

# How to setup fabric 
    "Usage: "
    "./setupFabric.sh [-h] [-s] [-f] [-t] [-n START|STOP]"
    "-h print this usage"
    "-s Cleanup docker container and workspace"
    "-f (Re)create fabric binaries and test sample network. Doesn't do anything else."
    "-t Test Fabric's sample byfn"
    "-g Generate cryptoconfig and channel transaction"
    "-n Network command. Accepts START or STOP"
    "-j Create channel and join all peers"

# How to setup composer and run code
    "Usage: "
    "./checkPrerequisite.sh [-h] [-c] [-d] [-i] [-l] [-r] [-n -k]"
    "-h print this usage"
    "-c Create PeerAdmin card"
    "-d [VERSION] Create and Deploy Business network"
    "-i [Identity name] create admin identity"
    "-n [VERSION] start network with given version with -k [Identity name] identity name to use"
    "-l list peer admin cards"
    "-r [CARDNAME] remove peer admin cards"
