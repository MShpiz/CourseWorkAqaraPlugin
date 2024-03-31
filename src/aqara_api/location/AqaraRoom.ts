import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraLocation } from "./AqaraLocation"
import { AqaraHub } from "./../device/aqaraHubDevice"
import { Device } from "./../device/device"
import { AqaraIRDevice } from "../device/aqaraIRDevice"
import { AqaraAcDevice } from "../device/aqaraACDevice"

export class AqaraRoom extends AqaraLocation {
    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: Map<string, any> | null = null) {
        super(api_instance, positionId, data)
    }

    getDevices(): Array<Device> {
        let kwargs = {
            "pageNum": 1,
            "pageSize": this.page_size,
            "positionId": this.positionId
        }
        let intent = this.api.makePostData("query.device.info", kwargs)
        let devInfo = this.api.makeApiRequest(intent)

        if (devInfo["code"] == 0) {
            throw Error("empty dev info")
        }
        let devices = new Array<Device>()
        for (let device of devInfo["result"]["data"]) {
            if (device["model"] in this.api.models) {
                devices.push(new AqaraHub(device["did"], device["deviceName"], device["model"], this.api))
            } else {
                let tmpDevice = new AqaraIRDevice(device["did"], device["deviceName"], device["model"], this.api)
                if (tmpDevice.getRemoteControl()["type"] == 2) {
                    devices.push(tmpDevice as AqaraAcDevice)
                } else {
                    devices.push(tmpDevice as AqaraIRDevice)
                }
            }
        }
        return devices
    }

    findHub(): Array<AqaraHub> {
        let result = Array<AqaraHub>()
        let devices = this.getDevices()
        for (let device of devices) {
            if (this.api.models.includes(device.getModelId())) {
                result.push(new AqaraHub(device.getDid(), device.getName(), device.getModelId(), this.api))
            }
        }
        return result
    }
}