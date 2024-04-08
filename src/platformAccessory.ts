import { Service, PlatformAccessory, CharacteristicValue, API, Characteristic } from 'homebridge';
import { AqaraIRDevice } from './aqara_api/device/aqaraIRDevice';
import { ButtonHandler } from "./platformButtons/ButtonHandler"
import { IRManadgerPlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class IRAccesory {

    private buttons: ButtonHandler[] = []
    private controlList: Service[] = []

    
    public readonly Characteristic: typeof Characteristic  = this.api.hap.Characteristic;

    constructor(
        private readonly platform: IRManadgerPlatform,
        private readonly accessory: PlatformAccessory,
        private readonly deviceApi: AqaraIRDevice,
        private readonly api: API
  ) {
    this.api = api
    // set accessory information
     this.accessory.getService(this.platform.Service.AccessoryInformation)!
         .setCharacteristic(this.platform.Characteristic.Manufacturer, this.deviceApi.getBrand())
         .setCharacteristic(this.platform.Characteristic.Model, this.deviceApi.getModelId());

      let buttonApi = (this.deviceApi as AqaraIRDevice).getButtons()
      for (let btn of buttonApi) {
          const targetControl = this.accessory.addService(this.platform.Service.TargetControl, btn.name, btn.name + btn.keyId);
          let btnHandler = new ButtonHandler(btn, deviceApi)

          targetControl.addCharacteristic(this.platform.Characteristic.Active).onGet(this.getActive.bind(this))
          targetControl.addCharacteristic(this.platform.Characteristic.Active).onSet(this.setActive.bind(this))

          targetControl.addCharacteristic(this.platform.Characteristic.ActiveIdentifier).onGet(this.getActiveId.bind(this))
          targetControl.addCharacteristic(this.platform.Characteristic.ActiveIdentifier).onSet(this.setActive.bind(this))

          targetControl.addCharacteristic(this.platform.Characteristic.ButtonEvent).onGet(btnHandler.handlePressEvent.bind(btnHandler))

          targetControl.addCharacteristic(this.platform.Characteristic.Name).onGet(btnHandler.getName.bind(btnHandler))

          this.buttons.push(btnHandler)
          this.controlList.push(targetControl)
      }
  }

    async getActive() {
        return this.platform.Characteristic.Active.ACTIVE
    }
    async getActiveId(): Promise<number> {
        return 1
    }

    async setActive() {
    }

    

}
