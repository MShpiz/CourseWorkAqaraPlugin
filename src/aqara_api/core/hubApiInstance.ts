import { StatelessApiInstance } from "./statelsessApiInstance"

export class HubApiInstance extends StatelessApiInstance {

    static override getRemoteControl(did: string) {
        let data = {
            "parentDid": did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.list", data))
        return result
    }
}