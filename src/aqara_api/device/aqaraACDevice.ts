import { AqaraIRDevice } from "./aqaraIRDevice"
import { AqaraAPI } from "./../core/aqaraAPI"
import { debug } from "node:util"
export class AqaraAcDevice extends AqaraIRDevice {
    private match: Array<string>
    constructor(did: string, name: string, model:string, api: AqaraAPI) {
        super(did, name, model,  api)
        this.match = new Array <string>()
    }

    pressButton(state: string): boolean {
        let data = {
            "did": this.did,
            "brandId": this.brandId,
            "isAcMatch": 1,
            "acKey": this.makestateString(state)
        }
        let result = this.api.makeApiRequest(this.api.makePostData("write.ir.click", data))
        
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
         let result: string[] = this.api.makeApiRequest(this.api.makePostData("query.ir.acState", data))["acState"].split('_')
         let state = {
             "power": 0,
             "mode": 0,
             "speed": 0,
             "temp": 0,
         }
         try {
             for (let elem of result) {
                 if (elem[0] == 'P') {
                     state["power"] = Number(elem.slice(1))
                 } else if (elem[0] == 'M') {
                     state["mode"] = Number(elem.slice(1))
                 } else if (elem[0] == 'T') {
                     state["temp"] = Number(elem.slice(1))
                 } else if (elem[0] == 'S') {
                     state["speed"] = Number(elem.slice(1))
                 }
             }
         } catch (e) {
             console.log(e)
         }
         return state
    }

    makestateString(state): string {
        return 'P' + state["power"] + '_' + 'M' + state["mode"] + '_' + 'T' + state["temp"] + '_' + 'S' + state["speed"]
    }
}