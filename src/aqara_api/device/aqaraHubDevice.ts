import { AqaraAPI } from "./../core/aqaraAPI"
import { Device } from "./device"
class AqaraHub extends Device {
 
    constructor(did: string, name: string, modelId: string, api: AqaraAPI) {
        super(did, name, modelId, api)
    }

    GetSubdevices() {
        return super.api.getHubChildren(super.did);
    }
}