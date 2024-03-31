import { AqaraIRDevice } from "./aqaraIRDevice"
import { AqaraAPI } from "./../core/aqaraAPI"
export class AqaraAcDevice extends AqaraIRDevice {
    private match: Array<string>
    constructor(did: string, name: string, model:string, api: AqaraAPI) {
        super(did, name, model,  api)
        this.match = new Array <string>()
    }

    pressButton(ac_btn: string): boolean {
        let data = {
            "did": this.did,
            "brandId": this.brandId,
            "isAcMatch": 1,
            "acKey": ac_btn
        }
        let result = this.api.makeApiRequest(this.api.makePostData("write.ir.click", data))
        // сделать поверку на ок if (!result)
        return true
    }

    getFunctions() {
        let data = {
            "did": this.did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.functions", data))
        return result
    }

     getState() {
        let data = {
            "did": this.did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.acState", data))
        return result
    }
}