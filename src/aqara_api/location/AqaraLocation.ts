import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraHome } from "./AqaraHome"
export { AqaraLocation };

class AqaraLocation {
    protected page_size: number = 100
    protected api: AqaraAPI
    protected positionId: string
    protected data: object|null

    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: object|null  = null) {
        if (positionId == null && data == null) {
            throw new Error()
        }
        this.api = api_instance
        this.data = data
        if (positionId != null) {
            this.positionId = positionId
        } else if (this.data != null) {
            this.positionId = this.data["positionId"]
        } else {
            this.positionId = String()
        }
    }

    get_all_homes() {
        let intent = this.api.makePostData("query.position.info", {})
        let home_info = this.api.makeApiRequest(intent)

        if (home_info["code"] == 0) {
            throw Error("no homes found")
        }
        let result: Array<AqaraHome> = new Array <AqaraHome>()
        home_info["result"]["data"].foreach(item => {
            result.push(new AqaraHome(this.api, item))
        })
        return result
    }

  }
       