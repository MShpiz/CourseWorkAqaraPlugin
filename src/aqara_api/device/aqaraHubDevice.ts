class AqaraHub extends Device {
 
    constructor(did: string, name: string, modelId: string, api: ApiInstance) {
        super(did, name, modelId, api)
    }

    GetSubdevices() {
        return this.api.getHubChildren(this.did);
    }
}