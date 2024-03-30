import { AqaraIRDevice } from "./aqaraIRDevice"
import { AqaraAPI } from "./../core/aqaraAPI"
class AqaraAcDevice extends AqaraIRDevice {
    private match: Array<string>
    constructor(did: string, name: string, modelId: string, api: AqaraAPI, brand: string) {
        super(did, name, modelId, api, brand)
        this.match = new Array <string>()
        this.getMatching()
    }

    getMatching() {
        // TODO(get matching from matching tree)
    }

    getMatch() {
        return this.match
    }

    pressButton(keyId: string): boolean {
        let data = {
            "did": this.did,
            "brandId": this.brandId,
            "isAcMatch": this.match,
            "keyId": keyId.split(',')[1].trim()
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