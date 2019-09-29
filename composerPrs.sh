#!/bin/sh

: '
    Script to ease out composer tasks.
'

# Check prerequisitie
function checkPrerequisite {
    HARDQUIT="FALSE"
    which composer
    if [ "$?" -ne 0 ] ; then
        echo "composer not found. It is required, please install composer."
        HARDQUIT="TRUE"
    else
        echo "composer installed..."
    fi

    if [ $HARDQUIT == "TRUE" ]; then
        exit 1
    fi
    echo "Prerequisite check is ok..."
}

# Prints usage
function usage() {
    echo "Usage: "
    echo "./checkPrerequisite.sh -h|a"
    echo "-h print this usage"
    echo "-c Create PeerAdmin card"
    echo "-d [VERSION] Create and Deploy Business network"
    echo "-i [Identity name] create admin identity"
    echo "-n [VERSION] start network with given version"
}

CARD_NAME="PeerAdmin@reliance-network-infrastructure"

function createMSPPeerAdmin() {
    CONNECTION_PROFILE=./reliance-network/networkConnectiom-INFRA.yaml
    MAS_KEY_LOCATION=./crypto-config/peerOrganizations/infrastructure.reliance-network.com/users/Admin@infrastructure.reliance-network.com/msp/keystore/
    if [ ! -f $MAS_KEY_LOCATION/*_sk ]; then
        echo "FATAL keystore not found"
        exit 1
    fi
    PRIVATE_KEY=`ls $MAS_KEY_LOCATION*_sk`
    echo $PRIVATE_KEY
    CERT=./crypto-config/peerOrganizations/infrastructure.reliance-network.com/users/Admin@infrastructure.reliance-network.com/msp/signcerts/Admin@infrastructure.reliance-network.com-cert.pem

    echo "Creating new card for PeerAdmin"    
    composer card create -p "$CONNECTION_PROFILE" -u PeerAdmin -c "$CERT" -k "$PRIVATE_KEY" -r PeerAdmin -r ChannelAdmin -f "${CARD_NAME}.card"

    # Check if a card with the same name has previously been imported? If yes, remove it before importing a new one.
    if composer card list -c $CARD_NAME >/dev/null; then
        echo "Deleting existing card"
        composer card delete -c $CARD_NAME
    fi

    echo "Importing created card"
    composer card import -f $CARD_NAME.card --card $CARD_NAME

    rm -f $CARD_NAME.card
}

#function createS4AFPeerAdmin() {}

#Creates composer peer admin card
function createPeerAdminCard() {
    createMSPPeerAdmin
    echo "List of cards imported at the end: "
    composer card list
}

#Function to create Business Network Archive file
function createBNA() {
    VERSION=$1
    echo "Creating business network archive version: $VERSION"
    if [ -d reliance-network/dist ]; then
        sudo rm reliance-network/dist/* -rf
    fi
    cd reliance-network
    npm version $1
    cd - 
    composer archive create -t dir -n ./reliance-network -a reliance-network/dist/reliance-network@${VERSION}.bna
}

#Function to install BNA
function installBNA() {
    VERSION=$1
    echo "Installing business network archive file of version: $VERSION"
    composer network install --card $CARD_NAME --archiveFile reliance-network/dist/reliance-network@${VERSION}.bna
    sleep 20
}

checkPrerequisite

while getopts "h?cd:i:n:" o; do
    case "$o" in
    h | /?)
        usage
        exit 0;;
    c)
        echo "Creating peer admin card"
        createPeerAdminCard
        exit 0
        ;;
    d)
        VERSION=$OPTARG
        createBNA $VERSION
        installBNA $VERSION
        exit 0;;
    i) 
        composer identity request -c $CARD_NAME -u admin -s adminpw -d $OPTARG
        exit 0;;
    n)
        VERSION=$OPTARG
        composer network start -c $CARD_NAME -n reliance-network -V $VERSION -o endorsementPolicyFile=./reliance-network/endorsement-policy.json -A gokul -C gokul/admin-pub.pem
        #composer network start -c $CARD_NAME -n reliance-network -V $VERSION -l DEBUG -A admin -S adminpwd -f reliance-network.card
        exit 0;;
    *)
        usage
        exit 1;;
    esac
done
