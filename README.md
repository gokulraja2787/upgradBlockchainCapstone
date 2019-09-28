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