import { debug } from "node:util";
import { AqaraAPI } from "./../core/aqaraAPI"
export { Device };
class Device {
    protected did: string
    protected name: string
    protected modelId: string = ""
    protected brandId: string = ""
    protected api: AqaraAPI

    constructor(did: string, name: string, model: string, api: AqaraAPI) {
        this.did = did
        this.name = name
        this.api = api
        this.modelId = model
        this.setModelBrand()
    }

    private setModelBrand() {
        let kwargs = this.api.makePostData("query.device.info", { "dids": [this.did] })
        let result = this.api.makeApiRequest(kwargs)
        try {
            this.brandId = result["data"][0]["brand"]
        } catch (e) {
            
        }
    }
    

    getDid() {
        return this.did;
    }

    getName() {
        return this.name;
    }

    getModelId() {
        return this.modelId;
    }

    getApiInstance() {
        return this.api;
    }

    getBrand() {
        return this.brandId
    }
}