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
    "./checkPrerequisite.sh [-h] [-c] [-d] [-i] [-l] [-r] [-n -k] [-u -k]"
    "-h print this usage"
    "-c Create PeerAdmin card"
    "-d [VERSION] Create and Deploy Business network"
    "-i [Identity name] create admin identity"
    "-n [VERSION] start network with given version with -k [Identity name] identity name to use"
    "-u [VERSION] upgrade network with given version with -k [Identity name] identity name to use"
    "-l list peer admin cards"
    "-r [CARDNAME] remove peer admin cards"

# How to do continuous development and deploy.
- Clone the source code
- Network name is reliance-network
- ./setupFabric.sh -g ==> This will generate crypo and channel artefacts
- ./setupFabric.sh -n START ==> This will start the fabric network
- ./setupFabric.sh -j ==> This will create channel and join all peers
- ./composerPrs.sh -c ==> This will create a PeerAdmin card (Only for one organisation [Reliance Infrastructure])
- ./composerPrs.sh -d [version] ==> This will create new relinance-network@[version].bna and install them in reliance-network
- ./composerPrs.sh -i [identityName] ==> This will create new identity with public and private key
- ./composerPrs.sh -n [version] -k [identityName] ==> This will initiate chaincode on reliance-network with given identity.
- composer-playground - if you want you use playgroung --or -- My faviroute approach
- composer-rest-server -c [identityName]@reliance-network -n never -u true -d rnet-log -w true
- cd rnet-ui
    - npm start   

## To upgrade to new .bna version
    - ./composerPrs.sh -d [version] ==> This will create new relinance-network@[version].bna and install them in reliance-network
    - ./composerPrs.sh -u [version] -k [identityName] ==> This will initiate updated chaincode on reliance-network with given identity.
