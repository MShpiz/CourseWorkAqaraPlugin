import { PlatformAccessory, API, Characteristic } from 'homebridge';
import { AqaraHub } from './aqara_api/device/aqaraHubDevice';
import { IRManadgerPlatform } from './platform';

export class HubAccesory {

    public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

    constructor(
        protected readonly platform: IRManadgerPlatform,
        protected readonly accessory: PlatformAccessory,
        protected readonly deviceApi: AqaraHub,
        protected readonly api: API
    ) {
        this.api = api
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(this.platform.Characteristic.Manufacturer, this.deviceApi.getBrand())
            .setCharacteristic(this.platform.Characteristic.Model, this.deviceApi.getModelId());
    }

}
