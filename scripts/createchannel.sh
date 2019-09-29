#!/bin/sh
export CHANNEL_NAME=reliancenetworkchannel

#echo "CORE_PEER_TLS_ENABLED: $CORE_PEER_TLS_ENABLED"

if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    echo "TLS Disabled"
    peer channel create -o orderer.reliance-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx
else
    echo "TLS enabled"
    echo "Using Infra MSP to create channel"

    peer channel create -o orderer.reliance-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/reliance-network.com/orderers/orderer.reliance-network.com/msp/tlscacerts/tlsca.reliance-network.com-cert.pem

    #peer channel create -o orderer.reliance-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls true --certfile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/reliance-network.com/orderers/orderer.reliance-network.com/msp/admincerts/Admin@reliance-network.com-cert.pem --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/reliance-network.com/orderers/orderer.reliance-network.com/msp/tlscacerts/tlsca.reliance-network.com-cert.pem
fi