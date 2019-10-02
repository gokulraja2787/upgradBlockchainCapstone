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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ContractService } from './Contract.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-contract',
  templateUrl: './Contract.component.html',
  styleUrls: ['./Contract.component.css'],
  providers: [ContractService]
})
export class ContractComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  contractId = new FormControl('', Validators.required);
  exporter = new FormControl('', Validators.required);
  importer = new FormControl('', Validators.required);
  shipper = new FormControl('', Validators.required);
  arrivalDateTime = new FormControl('', Validators.required);
  unitPrice = new FormControl('', Validators.required);
  minimumTemperature = new FormControl('', Validators.required);
  maximumTemperature = new FormControl('', Validators.required);
  minimumPenaltyFactor = new FormControl('', Validators.required);
  maximumPenaltyFactor = new FormControl('', Validators.required);
  maximumAcceleration = new FormControl('', Validators.required);

  constructor(public serviceContract: ContractService, fb: FormBuilder) {
    this.myForm = fb.group({
      contractId: this.contractId,
      exporter: this.exporter,
      importer: this.importer,
      shipper: this.shipper,
      arrivalDateTime: this.arrivalDateTime,
      unitPrice: this.unitPrice,
      minimumTemperature: this.minimumTemperature,
      maximumTemperature: this.maximumTemperature,
      minimumPenaltyFactor: this.minimumPenaltyFactor,
      maximumPenaltyFactor: this.maximumPenaltyFactor,
      maximumAcceleration: this.maximumAcceleration
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceContract.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'com.reliance.network.Contract',
      'contractId': this.contractId.value,
      'exporter': this.exporter.value,
      'importer': this.importer.value,
      'shipper': this.shipper.value,
      'arrivalDateTime': this.arrivalDateTime.value,
      'unitPrice': this.unitPrice.value,
      'minimumTemperature': this.minimumTemperature.value,
      'maximumTemperature': this.maximumTemperature.value,
      'minimumPenaltyFactor': this.minimumPenaltyFactor.value,
      'maximumPenaltyFactor': this.maximumPenaltyFactor.value,
      'maximumAcceleration': this.maximumAcceleration.value
    };

    this.myForm.setValue({
      'contractId': null,
      'exporter': null,
      'importer': null,
      'shipper': null,
      'arrivalDateTime': null,
      'unitPrice': null,
      'minimumTemperature': null,
      'maximumTemperature': null,
      'minimumPenaltyFactor': null,
      'maximumPenaltyFactor': null,
      'maximumAcceleration': null
    });

    return this.serviceContract.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'contractId': null,
        'exporter': null,
        'importer': null,
        'shipper': null,
        'arrivalDateTime': null,
        'unitPrice': null,
        'minimumTemperature': null,
        'maximumTemperature': null,
        'minimumPenaltyFactor': null,
        'maximumPenaltyFactor': null,
        'maximumAcceleration': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'com.reliance.network.Contract',
      'exporter': this.exporter.value,
      'importer': this.importer.value,
      'shipper': this.shipper.value,
      'arrivalDateTime': this.arrivalDateTime.value,
      'unitPrice': this.unitPrice.value,
      'minimumTemperature': this.minimumTemperature.value,
      'maximumTemperature': this.maximumTemperature.value,
      'minimumPenaltyFactor': this.minimumPenaltyFactor.value,
      'maximumPenaltyFactor': this.maximumPenaltyFactor.value,
      'maximumAcceleration': this.maximumAcceleration.value
    };

    return this.serviceContract.updateAsset(form.get('contractId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceContract.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceContract.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'contractId': null,
        'exporter': null,
        'importer': null,
        'shipper': null,
        'arrivalDateTime': null,
        'unitPrice': null,
        'minimumTemperature': null,
        'maximumTemperature': null,
        'minimumPenaltyFactor': null,
        'maximumPenaltyFactor': null,
        'maximumAcceleration': null
      };

      if (result.contractId) {
        formObject.contractId = result.contractId;
      } else {
        formObject.contractId = null;
      }

      if (result.exporter) {
        formObject.exporter = result.exporter;
      } else {
        formObject.exporter = null;
      }

      if (result.importer) {
        formObject.importer = result.importer;
      } else {
        formObject.importer = null;
      }

      if (result.shipper) {
        formObject.shipper = result.shipper;
      } else {
        formObject.shipper = null;
      }

      if (result.arrivalDateTime) {
        formObject.arrivalDateTime = result.arrivalDateTime;
      } else {
        formObject.arrivalDateTime = null;
      }

      if (result.unitPrice) {
        formObject.unitPrice = result.unitPrice;
      } else {
        formObject.unitPrice = null;
      }

      if (result.minimumTemperature) {
        formObject.minimumTemperature = result.minimumTemperature;
      } else {
        formObject.minimumTemperature = null;
      }

      if (result.maximumTemperature) {
        formObject.maximumTemperature = result.maximumTemperature;
      } else {
        formObject.maximumTemperature = null;
      }

      if (result.minimumPenaltyFactor) {
        formObject.minimumPenaltyFactor = result.minimumPenaltyFactor;
      } else {
        formObject.minimumPenaltyFactor = null;
      }

      if (result.maximumPenaltyFactor) {
        formObject.maximumPenaltyFactor = result.maximumPenaltyFactor;
      } else {
        formObject.maximumPenaltyFactor = null;
      }

      if (result.maximumAcceleration) {
        formObject.maximumAcceleration = result.maximumAcceleration;
      } else {
        formObject.maximumAcceleration = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'contractId': null,
      'exporter': null,
      'importer': null,
      'shipper': null,
      'arrivalDateTime': null,
      'unitPrice': null,
      'minimumTemperature': null,
      'maximumTemperature': null,
      'minimumPenaltyFactor': null,
      'maximumPenaltyFactor': null,
      'maximumAcceleration': null
      });
  }

}
