import { Device } from "./device"
import { AqaraAPI } from "./../core/aqaraAPI"
class AqaraIRDevice extends Device {
    private buttons: Array<IRButton> | null
    constructor(did: string, name: string, modelId: string, api: AqaraAPI) {
        super(did, name, modelId, api)
        this.buttons = null
    }

    GetButtons() {
        if (this.buttons != null) {
            return this.buttons
        }

        let kwargs = new Map<String, any>()
        kwargs["did"] = this.did;
        let intent = super.api.makePostData("query.ir.functions", kwargs)
        return super.api.makeApiRequest(intent)
    }

}

class IRButton {

}