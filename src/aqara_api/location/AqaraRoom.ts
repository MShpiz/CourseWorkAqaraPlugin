import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraLocation } from "./AqaraLocation"
import { AqaraHub } from "./../device/aqaraHubDevice"
import { AqaraIRDevice } from "./../device/aqaraIRDevice"

export class AqaraRoom extends AqaraLocation {
    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: Map<string, any> | null = null) {
        super(api_instance, positionId, data)
    }

    getDevices(): Array<AqaraIRDevice> {
        let kwargs = {
            "pageNum": 1,
            "pageSize": this.page_size,
            "positionId": this.positionId
        }
        let intent = super.api.makePostData("query.device.info", kwargs)
        let dev_info = super.api.makeApiRequest(intent)

        if (dev_info["code"] == 0) {
            throw Error("empty dev info")
        }
        dev_info = dev_info["result"]["data"]
        // прогнатьчерез цикл и создать массив девайсов
        //return dev_info
        return new Array < AqaraIRDevice>()
    }

    findHub(): Array<AqaraHub> {
        let result = Array<AqaraHub>()
        let devices = this.getDevices()
        for (let device of devices) {
            if (this.api.models.includes(device.getModelId())) {
                result.push(new AqaraHub(device.getDid(), device.getName(), device.getModelId(), this.api, device.getBrand()))
            }
        }
        return result
    }
}