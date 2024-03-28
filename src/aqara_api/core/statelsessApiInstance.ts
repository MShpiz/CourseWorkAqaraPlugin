import { AqaraAPI } from "./aqaraAPI"

export class StatelessApiInstance {
    protected static api: AqaraAPI = new AqaraAPI()

    static getButtons(did: string) {
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.keys", { "did": did }))
        return result
    }

    static pressButton(did: string, keyId: string, brand: string = String(), match: string = String()) {
        let data = {
            "did": did,
            "keyId": keyId.split(',')[1].trim()
        }
        let result = this.api.makeApiRequest(this.api.makePostData("write.ir.click", data))
        return result
    }
    static getRemoteControl(did: string) {
        let data = {
            "did": did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.info", data))
        return result
    }
}