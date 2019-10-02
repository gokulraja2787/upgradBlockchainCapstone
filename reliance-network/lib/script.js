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
 * 
 * @param {com.reliance.network.AccelerationReading} tx 
 * @transaction
 */
async function AccelerationReading(tx) {
    const contractRegistry = await getContractRegistry();
    const shipmentRegistry = await getShippmentRegistry();
    let shippment = tx.shipment;
    let contract = contractRegistry.get(shippment.contract.getIdentifier());
    /**
     * Acceleration Threshold
     * emit if accelratex < 10.4 and accelratey < 10.2 and accelratez < 10
     */
    if (10.4 > tx.accelerationX && 10.2 > tx.accelerationY && 10 > tx.accelerationZ) {
        let accelerationThresholdEvent = getAccelerationThreshold();
        accelerationThresholdEvent.accelerationX = tx.accelerationX;
        accelerationThresholdEvent.accelerationY = tx.accelerationY;
        accelerationThresholdEvent.accelerationZ = tx.accelerationZ;
        accelerationThresholdEvent.latitude = tx.latitude;
        accelerationThresholdEvent.longitude = tx.longitude;
        accelerationThresholdEvent.readingTime = tx.readingTime;
        accelerationThresholdEvent.message = "Acceleration is out of range";
        emit(accelerationThresholdEvent);
    }
    shippment.accelerationReading.push(tx);
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
async function getAccelerationThreshold() {
    let event = getFactory().newEvent('com.reliance.network', 'AccelerationThreshold');
    return event;
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
