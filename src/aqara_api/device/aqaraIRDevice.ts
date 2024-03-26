class AqaraIRDevice extends Device {
    private buttons: Array<IRButton> | null
    constructor(did: string, name: string, modelId: string, api: ApiInstance) {
        super(did, name, modelId, api)
        this.buttons = null
    }

    GetButtons() {
        if (this.buttons != null) {
            return this.buttons
        }

        let kwargs = new Map<String, any>()
        kwargs["did"] = this.did;
        let intent = this.api.makePostData("query.ir.functions", kwargs)
        return this.api.makeApiRequest(intent)
    }

}

class IRButton {

}