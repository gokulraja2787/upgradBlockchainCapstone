#!/bin/sh
export CHANNEL_NAME=reliancenetworkchannel

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/capital.reliance-network.com/users/Admin@capital.reliance-network.com/msp
CORE_PEER_ADDRESS=peer0.capital.reliance-network.com:7051
CORE_PEER_LOCALMSPID="capitalMSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/capital.reliance-network.com/peers/peer0.capital.reliance-network.com/tls/ca.crt

peer channel join -b $CHANNEL_NAME.block
sleep 10
# peer channel update -o orderer.capital.reliance-network.com:7050 -c $CHANNEL_NAME -f ../channel-artifacts/${CORE_PEER_LOCALMSPID}

CORE_PEER_ADDRESS=peer1.capital.reliance-network.com:7051
CORE_PEER_LOCALMSPID="capitalMSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/capital.reliance-network.com/peers/peer1.capital.reliance-network.com/tls/ca.crt

peer channel join -b $CHANNEL_NAME.block
sleep 10
# peer channel update -o orderer.capital.reliance-network.com:7050 -c $CHANNEL_NAME -f ../channel-artifacts/${CORE_PEER_LOCALMSPID}
