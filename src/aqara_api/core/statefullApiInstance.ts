import { StatelessApiInstance } from "./statelsessApiInstance"

export class StatefullAliInstance extends StatelessApiInstance {
    
    static pressButton(did: string, keyId: string, brand: string, match: string) {
        let data = {
            "did": "ir.1200212110625632256",
            "brandId": brand,
            "isAcMatch": match,
            "keyId": keyId.split(',')[1].trim()
        }
        let result = this.api.makeApiRequest(this.api.makePostData("write.ir.click", data))
        return result
    }

    static getFunctions(did: string) {
        let data = {
            "did": did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.functions", data))
        return result
    }

    static getState(did: string) {
        let data = {
            "did": did,
        }
        let result = this.api.makeApiRequest(this.api.makePostData("query.ir.acState", data))
        return result
    }

    static getmatch() {
         //TODO()
    }
}