#!/usr/bin/sh
# Author: Gokul Rangarajan
# Date: September 28, 2019
# Script to setup and resetup fabric for reliance network
# For upgard capstone project

: '
    Script to clean and setup fabric system.
    1) Checks prerequiste.
    2) Set environment variables
    3) Clean up running docker container.
    4) Clean up existing fabric workplace.
    5) Create new fabric workspace.
    6) Create fabric network for property-registration-system
    7) Create Channel and join all peers
'
# Prints usage
function usage() {
    echo "Usage: "
    echo "./setupFabric.sh [-h|-s] [-f] [-t] [-n START|STOP]"
    echo "-h print this usage"
    echo "-s Cleanup docker container and workspace"
    echo "-f (Re)create fabric binaries and test sample network. Doesn't do anything else."
    echo "-t Test Fabric's sample byfn"
    echo "-g Generate cryptoconfig and channel transaction"
    echo "-n Network command. Accepts START or STOP"
    echo "-j Create channel and join all peers"
}

# Check prerequisitie
function checkPrerequisite {
    HARDQUIT="FALSE"
    echo "Check if docker container service running..."
    if ps -ef | grep dockerd | grep -v grep > /dev/null; then 
        echo "Docker running"
    else
        echo "docker is not running. Please run docker container to begin."; 
        HARDQUIT="TRUE"
    fi
    echo "Finding docker compose..."
    which docker-compose
    if [ "$?" -ne 0 ] ; then
        echo "docker-compose not found. It is required, please install docker-compose."
        HARDQUIT="TRUE"
    else
        echo "docker-compose installed..."
    fi
    which git
    if [ "$?" -ne 0 ] ; then
        echo "git not found. It is required, please install git."
        HARDQUIT="TRUE"
    else
        echo "git installed..."
    fi

    if [ $HARDQUIT == "TRUE" ]; then
        exit 1
    fi
    echo "Prerequisite check is ok..."
}

# Function to set environment variables
function setEnvironmentVariables() {
    export RNET_WORKSPACE=$(dirname "$0")
    echo "COMPOSE_PROJECT_NAME=reliance" > $RNET_WORKSPACE/.env
    export FABRIC_TOOLS=$RNET_WORKSPACE/fabric-samples/bin
    export CHANNEL_NAME=reliancenetworkchannel
    PATH=$PATH:$FABRIC_TOOLS
}

# Function to cleanup docker container and workspace
function cleanUpAnyRunningDockerContainer() {
    sudo docker system prune -af
    sudo docker volume prune -f
    sudo rm -rf ./channel-artifacts ./crypto-config ./docker-compose-cli.yaml
}

# (Re)create fabric bin by cloning fabric-sample and test it
function createFabricBin() {
    if [ -d ./fabric-samples ]; then
        sudo rm -rf ./fabric-samples
    fi
    git clone https://github.com/hyperledger/fabric-samples.git 
    curl -sS https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh -o ./fabric-samples/scripts/bootstrap.sh
    chmod +x ./fabric-samples/scripts/bootstrap.sh
    testFabric
}

# Test fabric using sample byfn
function testFabric() {
    if [ -d ./fabric-samples ]; then
        . ./fabric-samples/scripts/bootstrap.sh
        cd first-network
        sudo ./byfn.sh up
        sudo ./byfn.sh down
        cleanUpAnyRunningDockerContainer
    else
        createFabricBin
    fi
}

#Generate docker CLI
function generateDockerComposeCliFile() {
    if [ -f docker-compose-cli.yaml ]; then
        rm -f docker-compose-cli.yaml
    fi
    cp docker-compose-cli-template.yaml docker-compose-cli.yaml
    CURR_DIR=${PWD}
    cd crypto-config/peerOrganizations/infrastructure.reliance-network.com/ca/ || exit
    PRIV_KEY=$(ls *_sk)
    cd "${CURR_DIR}"
    sed -i "s/INFRA_PRV_KEY_TP_REPLACE/${PRIV_KEY}/g" docker-compose-cli.yaml
    cd crypto-config/peerOrganizations/power.reliance-network.com/ca/ || exit
    PRIV_KEY=$(ls *_sk)
    cd "${CURR_DIR}"
    sed -i "s/POWER_PRV_KEY_TP_REPLACE/${PRIV_KEY}/g" docker-compose-cli.yaml
    cd crypto-config/peerOrganizations/communication.reliance-network.com/ca/ || exit
    PRIV_KEY=$(ls *_sk)
    cd "${CURR_DIR}"
    sed -i "s/COMM_PRV_KEY_TP_REPLACE/${PRIV_KEY}/g" docker-compose-cli.yaml
    cd crypto-config/peerOrganizations/entertainment.reliance-network.com/ca/ || exit
    PRIV_KEY=$(ls *_sk)
    cd "${CURR_DIR}"
    sed -i "s/ENTR_PRV_KEY_TP_REPLACE/${PRIV_KEY}/g" docker-compose-cli.yaml
    cd crypto-config/peerOrganizations/capital.reliance-network.com/ca/ || exit
    PRIV_KEY=$(ls *_sk)
    cd "${CURR_DIR}"
    sed -i "s/CAP_PRV_KEY_TP_REPLACE/${PRIV_KEY}/g" docker-compose-cli.yaml
}

# Function to (re)create crypto config and channel tx
function generateCryptoAndTX() {
    if [ ! -d ./fabric-samples ]; then
        echo "$FABRIC_TOOLS not found. Cloning Fabric bin"
        createFabricBin
        cd $RNET_WORKSPACE
    fi
    echo "Generate Crypto-config"
    ${FABRIC_TOOLS}/cryptogen generate --config ./crypto-config.yaml --output="./crypto-config"
    mkdir ./channel-artifacts
    echo "Generate genesis"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block
    echo "Generate channel tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
    echo "Generate Reliance Infrastructure  tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputAnchorPeersUpdate ./channel-artifacts/RINFRAAnchor.tx -channelID $CHANNEL_NAME -asOrg INFRASTRUCTUREMSP
    echo "Generate Reliance power tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputAnchorPeersUpdate ./channel-artifacts/RPOWERAnchor.tx -channelID $CHANNEL_NAME -asOrg POWERMSP
    echo "Generate Reliance communication tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputAnchorPeersUpdate ./channel-artifacts/RCOMMAnchor.tx -channelID $CHANNEL_NAME -asOrg COMMUNICATIONMSP
    echo "Generate Reliance entertainment tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputAnchorPeersUpdate ./channel-artifacts/RENTERAnchor.tx -channelID $CHANNEL_NAME -asOrg ENTERTAINMENTMSP
    echo "Generate Reliance capital tx"
    ${FABRIC_TOOLS}/configtxgen -configPath ./ -profile ChannelRegOrgs -outputAnchorPeersUpdate ./channel-artifacts/RCAPAnchor.tx -channelID $CHANNEL_NAME -asOrg CAPITALMSP
    generateDockerComposeCliFile
}

# Function to start property registration network
function startNetwork() {
    echo "Start network";
    sudo docker-compose -f ./docker-compose-cli.yaml up -d
    echo "Start cli"
    sudo docker start cli
    #createChannelAndJoinPeers
}

# Function to stop property registration network
function stopNetwork() {
    echo "Stop cli"
    sudo docker stop cli
    echo "Stop network"
    sudo docker-compose -f ./docker-compose-cli.yaml down
}

# Function to create channel and join all peers
function createChannelAndJoinPeers() {
    echo "Creating channel"
    sudo docker exec -it cli ./scripts/createchannel.sh
    sleep 10

    echo "Join peers Reliance infrastructure"
    sudo docker exec -it cli ./scripts/connectINFRAPeers.sh

    echo "Join peers Reliance power"
    sudo docker exec -it cli ./scripts/connectPOWERPeers.sh

    echo "Join peers Reliance communication"
    sudo docker exec -it cli ./scripts/connectCOMMPeers.sh

    echo "Join peers Reliance Entertainment"
    sudo docker exec -it cli ./scripts/connectENTPeers.sh

    echo "Join peers Reliance Capital"
    sudo docker exec -it cli ./scripts/connectCAPPeers.sh

    # echo "Done!"
}

#Check Prerequisite
checkPrerequisite

#Setup environment variables
setEnvironmentVariables

while getopts "h?sftgn:j" o; do
    case "$o" in
    h | /?)
        usage
        exit 0;;
    s)
        #Cleanup Running Docker Container
        echo "Stop running docker"
        sudo docker-compose -f docker-compose-cli.yaml down
        echo "Cleaning up docker container images and existing fabric workspace"
        cleanUpAnyRunningDockerContainer
        ;;
    f)
        createFabricBin
        exit 0;;
    t)
        testFabric
        exit 0;;
    g) 
        generateCryptoAndTX
        exit 0;;
    n)
        ACTION=$OPTARG
        if [ $ACTION == "START" ]; then
            startNetwork
        elif [ $ACTION == "STOP" ]; then
            stopNetwork
        else
            echo "Invalid command $ACTION"
            usage
            exit -1
        fi
        exit 0;;
    j) 
        createChannelAndJoinPeers
        exit 0;;
    esac
done

