import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { IRAccesory } from './platformAccessory';
import { ACIRAccesory } from './platformAcAccessory';
import { AqaraAPI } from './aqara_api/core/aqaraAPI';
import { AqaraAcDevice } from './aqara_api/device/aqaraACDevice';
import { AqaraIRDevice } from './aqara_api/device/aqaraIRDevice';
import { AqaraLocation } from './aqara_api/location/AqaraLocation';
import { AqaraHome } from './aqara_api/location/AqaraHome';
import { HubAccesory } from './PlatformHubAccesory'
import { AqaraHub } from './aqara_api/device/aqaraHubDevice';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class IRManadgerPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

    // this is used to track restored cached accessories
    public readonly accessories: PlatformAccessory[] = [];

    private readonly irAccesries: IRAccesory[] = []
    private rootLocation: AqaraLocation = new AqaraLocation(new AqaraAPI())

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
      this.log.debug('Finished initializing platform:', this.config.name);

    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      
      this.discoverDevices();
    });
  }


    configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

    discoverDevices() {
        let homes: Array<AqaraHome> = this.rootLocation.getAllHomes()
        for (let home of homes) {
            for (let device of home.getDevices()) {
                const uuid = this.api.hap.uuid.generate(device.getDid());
                const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
                if (existingAccessory) {
                    // the accessory already exists
                    this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                    existingAccessory.context.device = device;
                    this.api.updatePlatformAccessories([existingAccessory]);
                    
                } else {

                    const accessory = new this.api.platformAccessory(device["name"], device["did"]);
                    accessory.context.device = device;

                    let curr
                    if (device instanceof AqaraAcDevice) {
                        curr = new ACIRAccesory(this, accessory, device as AqaraAcDevice, this.api);
                    } else if (device instanceof AqaraIRDevice) {
                        curr = new IRAccesory(this, accessory, device as AqaraIRDevice, this.api);
                    } else {
                        curr = new HubAccesory(this, accessory, device as AqaraHub, this.api);
                    }
                    
                    this.irAccesries.push(curr)
                    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
                }
            }
        }
  }
}
