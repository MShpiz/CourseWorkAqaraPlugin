import { Service, PlatformAccessory, CharacteristicValue, API, Characteristic } from 'homebridge';
import { AqaraIRDevice } from './aqara_api/device/aqaraIRDevice';
import { AqaraAcDevice } from './aqara_api/device/aqaraACDevice';
import { IRManadgerPlatform } from './platform';
import { Device } from './aqara_api/device/device';
import { IRAccesory } from './platformAccessory'

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ACIRAccesory extends IRAccesory {

    public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
    private service: Service
    

    constructor(
        platform: IRManadgerPlatform,
        accessory: PlatformAccessory,
        deviceApi: AqaraAcDevice,
        api: API
    ) {
        super(platform, accessory, deviceApi, api)

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
