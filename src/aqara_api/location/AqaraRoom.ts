import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraLocation } from "./AqaraLocation"
export { AqaraRoom };

class AqaraRoom extends AqaraLocation {
    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: Map<string, any> | null = null) {
        super(api_instance, positionId, data)
    }

    getDevices() {
        let kwargs = new Map<string, string | number>([
            ["pageNum", 1],
            ["pageSize", super.page_size],
            ["positionId", super.positionId]
        ])
        let intent = super.api.makePostData("query.device.info", kwargs)
        let dev_info = super.api.makeApiRequest(intent)

        if (dev_info["code"] == 0) {
            throw Error("empty dev info")
        }
        dev_info = dev_info["result"]["data"]
        // return dev_info
    }
}