import { AqaraAPI } from "./../core/aqaraAPI"
export { Device };
class Device {
    protected did: string
    protected name: string
    protected modelId: string
    protected api: AqaraAPI

    constructor(did: string, name: string, modelId: string, api: AqaraAPI) {
        this.did = did
        this.name = name
        this.modelId = modelId
        this.api= api
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
}