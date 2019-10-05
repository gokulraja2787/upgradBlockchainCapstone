/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Transaction processing for reliance-network are
 * defined here
 */

/**
 * Acceration reading transaction
 * 
 * @param {com.reliance.network.AccelerationReading} tx 
 * @transaction
 */
async function AccelerationReading(tx) {
    const contractRegistry = await getContractRegistry();
    const shipmentRegistry = await getShippmentRegistry();
    let shippment = tx.shipment;
    let contract = await contractRegistry.get(shippment.contract.getIdentifier());
    /**
     * Acceleration Threshold
     * emit if sum of accelration x,y,z is > accelrationThreshold .
     */
    printDebug(`${tx.accelerationX + tx.accelerationY + tx.accelerationZ} < ${contract.maximumAcceleration}`)
    if (contract.maximumAcceleration < tx.accelerationX + tx.accelerationY + tx.accelerationZ) {
        let accelerationThresholdEvent = getAccelerationThreshold();
        accelerationThresholdEvent.accelerationX = tx.accelerationX;
        accelerationThresholdEvent.accelerationY = tx.accelerationY;
        accelerationThresholdEvent.accelerationZ = tx.accelerationZ;
        accelerationThresholdEvent.latitude = tx.latitude;
        accelerationThresholdEvent.longitude = tx.longitude;
        if (tx.readingTime) {
            accelerationThresholdEvent.readingTime = tx.readingTime;
        } else {
            accelerationThresholdEvent.readingTime = "No Input"
        }
        accelerationThresholdEvent.message = "Acceleration reading reached threshold";
        accelerationThresholdEvent.shipment = shippment;
        emit(accelerationThresholdEvent);
    }
    shippment.accelerationReading.push(tx);
    await shipmentRegistry.update(shippment);
}

/**
 * 
 * Temperature Reading transaction
 * 
 * @param {com.reliance.network.TemperatureReading} tx
 * @transaction 
 */
async function TemperatureReading(tx) {

    const contractRegistry = await getContractRegistry();
    const shipmentRegistry = await getShippmentRegistry();
    let shippment = tx.shipment;
    let contract = await contractRegistry.get(shippment.contract.getIdentifier());

    let celcius = tx.celcius;
    let latitude = tx.latitude;
    let longitude = tx.longitude;
    let readingTime = tx.readingTime;

    /**
     * check if celcius is within the contract's minimum and maximum temperature limit.
     * if not emit TemperatureThreshold event
     */
    printDebug(`Comparing ${celcius} with ${contract.minimumTemperature} & ${contract.maximumTemperature}`)
    if (celcius < contract.minimumTemperature || celcius > contract.maximumTemperature) {
        let event = getTemperatureThreshold();
        event.temperature = celcius;
        event.latitude = latitude;
        event.longitude = longitude;
        event.readingTime = readingTime;
        event.message = "Temperature reading reached threshold"
        event.shipment = shippment;
        emit(event);
        printDebug(`Event emitted`);
    }

    shippment.temperatureReading.push(tx);
    await shipmentRegistry.update(shippment);
}

/**
 * 
 * @param {com.reliance.network.GPSReading} tx
 * @transaction 
 */
async function GPSReading(tx) {
    let latitude = tx.latitude;
    let longitude = tx.longitude;
    let latitudeDirection = tx.latitudeDirection;
    let longitudeDirection = tx.longitudeDirection;
    let readingTime = tx.readingTime;
    let readingDate = tx.readingDate;

    const contractRegistry = await getContractRegistry();
    const shipmentRegistry = await getShippmentRegistry();
    let shippment = tx.shipment;
    let contract = await contractRegistry.get(shippment.contract.getIdentifier());

    shippment.gpsReading.push(tx);
    await shipmentRegistry.update(shippment);

}

/**
 * Get contract registry
 * @returns {AssetRegistry} contractRegistry
 */
async function getContractRegistry() {
    const contractRegistry = await getAssetRegistry('com.reliance.network.Contract');
    return contractRegistry;
}

/**
 * Get shipment registry
 * @returns {AssetRegistry} shipmentRegistry
 */
async function getShippmentRegistry()  {
    const shipmentRegistry = await getAssetRegistry('com.reliance.network.Shipment');
    return shipmentRegistry;
}

/**
 * Get shipper registry
 * @returns {ParicipantRegistry} shipperRegistry
 */
async function getShipperRegistry() {
    const shipperRegistry = await getAssetRegistry('com.reliance.network.Shipper');
    return shipperRegistry;
}

/**
 * Get exporter registry
 * @returns {ParicipantRegistry} exporterRegistry
 */
async function getExporterRegistry() {
    const paricipantRegistry = await getAssetRegistry('com.reliance.network.Exporter');
    return paricipantRegistry;
}

/**
 * Get importer registry
 * @returns {ParicipantRegistry} importerRegistry
 */
async function getImporterRegistry() {
    const importerRegistry = await getAssetRegistry('com.reliance.network.Importer');
    return importerRegistry;
}

/**
 * getAccelerationThreshold event
 * @returns {Event} AccelerationThreshold
 */
function getAccelerationThreshold() {
    let event = getFactory().newEvent('com.reliance.network', 'AccelerationThreshold');
    return event;
}

/**
 * getTemperatureThreshold event
 * @returns {Event} TemperatureThreshold
 */
function getTemperatureThreshold() {
    let event = getFactory().newEvent('com.reliance.network', 'TemperatureThreshold');
    return event;
}

/**
 * getShipmentInPort event
 * @returns {Event} ShipmentInPort
 */
function getShipmentInPort() {
    let event = getFactory().newEvent('com.reliance.network', 'ShipmentInPort');
    return event;
}

function printDebug(message) {
    console.log(`@rnet-debug ${message}`)
}

/**
 * Sample transaction
 * param {com.reliance.network.SampleTransaction} sampleTransaction
 * transaction
 *
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('com.reliance.network.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('com.reliance.network', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}*/
