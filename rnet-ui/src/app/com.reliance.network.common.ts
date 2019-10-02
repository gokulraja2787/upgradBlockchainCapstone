import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {Shipment} from './com.reliance.network';
// export namespace com.reliance.network.common{
   export enum AssetType {
      Medicine,
      Fuel,
      Truck,
      Wire,
      Table,
      Chair,
      Laptop,
      Phone,
   }
   export enum ShipmentStatus {
      Created,
      InTransit,
      Arrived,
   }
   export enum CompassDirection {
      N,
      E,
      S,
      W,
   }
   export abstract class ShipmentTransaction extends Transaction {
      shipment: Shipment;
   }
// }
