#!/bin/sh
export CHANNEL_NAME=reliancenetworkchannel

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/infrastructure.reliance-network.com/users/Admin@infrastructure.reliance-network.com/msp
CORE_PEER_ADDRESS=peer0.infrastructure.reliance-network.com:7051
CORE_PEER_LOCALMSPID="infrastructureMSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/infrastructure.reliance-network.com/peers/peer0.infrastructure.reliance-network.com/tls/ca.crt

peer channel join -b $CHANNEL_NAME.block
sleep 10
# peer channel update -o orderer.power.reliance-network.com:7050 -c $CHANNEL_NAME -f ../channel-artifacts/${CORE_PEER_LOCALMSPID}

CORE_PEER_ADDRESS=peer1.infrastructure.reliance-network.com:7051
CORE_PEER_LOCALMSPID="infrastructureMSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/infrastructure.reliance-network.com/peers/peer1.infrastructure.reliance-network.com/tls/ca.crt

peer channel join -b $CHANNEL_NAME.block
sleep 10
# peer channel update -o orderer.power.reliance-network.com:7050 -c $CHANNEL_NAME -f ../channel-artifacts/${CORE_PEER_LOCALMSPID}
