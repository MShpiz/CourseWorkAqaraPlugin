import { AqaraAPI } from "./../core/aqaraAPI"
import { Device } from "./device"
export class AqaraHub extends Device {
    
    constructor(did: string, name: string, modelId: string, api: AqaraAPI, brand: string) {
        super(did, name, modelId, api, brand)
    }

    GetSubdevices() {
        let data = {
            "parentDid": this.did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.list", data))
        return result
    }
}