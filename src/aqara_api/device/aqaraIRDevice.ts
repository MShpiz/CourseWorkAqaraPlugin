import { Device } from "./device"
import { AqaraAPI } from "./../core/aqaraAPI"
export class AqaraIRDevice extends Device {
    protected buttons: Array<IRButton> | null
    constructor(did: string, name: string, model:string,  api: AqaraAPI) {
        super(did, name, model,  api)
        this.buttons = null
    }

    getButtons() {
        if (this.buttons != null) {
            return this.buttons
        }

        let buttons = this.api.makeApiRequest(this.api.makePostData("query.ir.keys", { "did": this.did }))
        let result = this.convertToIrButtons(buttons)
        return result
    }

    pressButton(keyId: string): boolean {
        let data = {
            "did": this.did,
            "keyId": keyId.split(',')[1].trim()
        }
        let result = this.api.makeApiRequest(this.api.makePostData("write.ir.click", data))
        // ������� ������� �� �� if (!result)
        return true
    }
    getRemoteControl() {
        let data = {
            "did": this.did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.info", data))
        return result
    }

    convertToIrButtons(buttons: object) {
        if (this.buttons == null) {
            this.buttons = new Array <IRButton>()
        }
        for (let btn of buttons["keys"]) {
            this.buttons?.push(new IRButton(btn["name"], btn["controllerId"], btn["irKeyId"], btn["keyId"]))
        }
    }

}

class IRButton {
    constructor(public readonly name: string,
        public readonly controllerId: string,
        public readonly irKeyId: string,
        public readonly keyId: string) {
    }
}