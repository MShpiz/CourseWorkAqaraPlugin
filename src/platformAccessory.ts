import { Service, PlatformAccessory, CharacteristicValue, API, Characteristic } from 'homebridge';
import { AqaraIRDevice } from './aqara_api/device/aqaraIRDevice';
import { Device } from './aqara_api/device/device';

import { IRManadgerPlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class IRAccesory {
  private service: Service;

    
    public readonly Characteristic: typeof Characteristic  = this.api.hap.Characteristic;

  constructor(
      private readonly platform: IRManadgerPlatform,
      private readonly accessory: PlatformAccessory,
      private deviceApi: Device,
      public readonly api: API
  ) {
    this.api = api
    // set accessory information
     this.accessory.getService(this.platform.Service.AccessoryInformation)!
          .setCharacteristic(this.platform.Characteristic.Manufacturer, deviceApi.getBrand())
          .setCharacteristic(this.platform.Characteristic.Model, deviceApi.getModelId());


     this.service = this.accessory.getService(this.platform.Service.TargetControl) || this.accessory.addService(this.platform.Service.TargetControl);
     this.Characteristic = this.api.hap.Characteristic;
     this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);


      //this.Characteristic.ButtonEvent.
      // register handlers for the On/Off Characteristic
      this.service.getCharacteristic(this.Characteristic.Active)
          .onGet(this.handleActiveGet.bind(this))
          .onSet(this.handleActiveSet.bind(this));

      this.service.getCharacteristic(this.Characteristic.ActiveIdentifier)
          .onGet(this.handleActiveIdentifierGet.bind(this))
          .onSet(this.handleActiveIdentifierSet.bind(this));

      this.service.getCharacteristic(this.Characteristic.ButtonEvent)
          .onGet(this.handleButton.bind(this));

    /**
     * Creating multiple services of the same type.
     *
     * To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
     * when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
     * this.accessory.getService('NAME') || this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE_ID');
     *
     * The USER_DEFINED_SUBTYPE must be unique to the platform accessory (if you platform exposes multiple accessories, each accessory
     * can use the same sub type id.)
     */

    // Example: add two "motion sensor" services to the accessory
    const motionSensorOneService = this.accessory.getService('Motion Sensor One Name') ||
      this.accessory.addService(this.platform.Service.MotionSensor, 'Motion Sensor One Name', 'YourUniqueIdentifier-1');

    const motionSensorTwoService = this.accessory.getService('Motion Sensor Two Name') ||
      this.accessory.addService(this.platform.Service.MotionSensor, 'Motion Sensor Two Name', 'YourUniqueIdentifier-2');

    /**
     * Updating characteristics values asynchronously.
     *
     * Example showing how to update the state of a Characteristic asynchronously instead
     * of using the `on('get')` handlers.
     * Here we change update the motion sensor trigger states on and off every 10 seconds
     * the `updateCharacteristic` method.
     *
     */
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    this.exampleStates.On = value as boolean;

    this.platform.log.debug('Set Characteristic On ->', value);
  }

}
