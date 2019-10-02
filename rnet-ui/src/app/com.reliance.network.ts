import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {AssetType,ShipmentStatus,CompassDirection} from './com.reliance.network.common';
// export namespace com.reliance.network{
   export class Exporter extends Participant {
      exporterId: string;
      email: string;
      address: string;
      accountBalance: number;
   }
   export class Shipper extends Participant {
      shipperID: string;
      email: string;
      address: string;
      accountBalance: number;
   }
   export class Importer extends Participant {
      importerId: string;
      email: string;
      address: string;
      accountBalance: number;
   }
   export class Shipment extends Asset {
      shipmentId: string;
      AssetType: AssetType;
      ShipmentStatus: ShipmentStatus;
      unitCount: number;
      contract: Contract;
      temperatureReading: TemperatureReading[];
      accelerationReading: AccelerationReading[];
      gpsReading: GPSReading[];
   }
   export class Contract extends Asset {
      contractId: string;
      exporter: Exporter;
      importer: Importer;
      shipper: Shipper;
      arrivalDateTime: Date;
      unitPrice: number;
      minimumTemperature: number;
      maximumTemperature: number;
      minimumPenaltyFactor: number;
      maximumPenaltyFactor: number;
      maximumAcceleration: number;
   }
   export class TemperatureThreshold extends Event {
      temperature: number;
      message: string;
      latitude: string;
      longitude: string;
      readingTime: string;
      shipment: Shipment;
   }
   export class AccelerationThreshold extends Event {
      accelerationX: number;
      accelerationY: number;
      accelerationZ: number;
      message: string;
      latitude: string;
      longitude: string;
      readingTime: string;
      shipment: Shipment;
   }
   export class ShipmentInPort extends Event {
      message: string;
      shipment: Shipment;
   }
   export abstract class ShipmentTransaction extends Transaction{
      shipment: Shipment;
   }
   export class TemperatureReading extends ShipmentTransaction {
      celcius: number;
      latitude: string;
      longitude: string;
      readingTime: string;
   }
   export class AccelerationReading extends ShipmentTransaction {
      accelerationX: number;
      accelerationY: number;
      accelerationZ: number;
      latitude: string;
      longitude: string;
      readingTime: string;
   }
   export class GPSReading extends ShipmentTransaction {
      latitude: string;
      longitude: string;
      latitudeDirection: CompassDirection;
      longitudeDirection: CompassDirection;
      readingTime: string;
      readingDate: string;
   }
   export class ShipmentReceived extends ShipmentTransaction {
   }
// }
