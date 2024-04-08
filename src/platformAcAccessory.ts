import { Service, PlatformAccessory, CharacteristicValue, API, Characteristic } from 'homebridge';
import { AqaraAcDevice } from './aqara_api/device/aqaraACDevice';
import { IRManadgerPlatform } from './platform';


/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ACIRAccesory {

    public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
    private service: Service
    

    constructor(
        private readonly platform: IRManadgerPlatform,
        private readonly accessory: PlatformAccessory,
        private readonly deviceApi: AqaraAcDevice,
        private readonly api: API
    ) {
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(this.platform.Characteristic.Manufacturer, this.deviceApi.getBrand())
            .setCharacteristic(this.platform.Characteristic.Model, this.deviceApi.getModelId());

        this.service = this.accessory.addService(this.platform.Service.HeaterCooler);
        this.service.addCharacteristic(this.platform.Characteristic.Active).onGet(this.getAcActive.bind(this))
        this.service.addCharacteristic(this.platform.Characteristic.CurrentHeaterCoolerState).onGet(this.getCurrentState.bind(this))
        this.service.addCharacteristic(this.platform.Characteristic.TargetHeaterCoolerState).onGet(this.getTargetState.bind(this))
        this.service.addCharacteristic(this.platform.Characteristic.TargetHeaterCoolerState).onSet(this.setTargetState.bind(this))
        this.service.addCharacteristic(this.platform.Characteristic.CurrentTemperature).onSet(this.getTemp.bind(this))
    }

    async getAcActive() {
        if ((this.deviceApi as AqaraAcDevice).getState()["power"] == 1) {
            return  this.platform.Characteristic.Active.ACTIVE
        }

        return this.platform.Characteristic.Active.INACTIVE
    }

    async getCurrentState() {
        let state = (this.deviceApi as AqaraAcDevice).getState()
        if (state["power"] == 1) {
            return this.Characteristic.CurrentHeaterCoolerState.INACTIVE
        }
        switch (state["mode"]) {
            case (0):
                return this.Characteristic.CurrentHeaterCoolerState.COOLING
            case (1):
                return this.Characteristic.CurrentHeaterCoolerState.HEATING
            default:
                return this.Characteristic.CurrentHeaterCoolerState.IDLE
        }
    }

    async getTargetState() {
        let state = (this.deviceApi as AqaraAcDevice).getState()
      
        switch (state["mode"]) {
            case (0):
                return this.Characteristic.TargetHeaterCoolerState.COOL
            case (1):
                return this.Characteristic.TargetHeaterCoolerState.HEAT
            default:
                return this.Characteristic.TargetHeaterCoolerState.AUTO
        }
    }

    async setTargetState(characteristic) {
        let state = {
            "power": 0,
            "mode": 0,
            "speed": 0,
            "temp": 0,
        }
        if (characteristic == this.Characteristic.TargetHeaterCoolerState.COOL) {
            (this.deviceApi as AqaraAcDevice).pressButton("M0")
        } else if (characteristic == this.Characteristic.TargetHeaterCoolerState.HEAT) {
            (this.deviceApi as AqaraAcDevice).pressButton("M1")
        } else if (characteristic == this.Characteristic.TargetHeaterCoolerState.AUTO) {
            (this.deviceApi as AqaraAcDevice).pressButton("M2")
        } else {
            (this.deviceApi as AqaraAcDevice).pressButton("M2")
        }
    }

    async getTemp() {
        return (this.deviceApi as AqaraAcDevice).getState()["temp"]
    }


}
