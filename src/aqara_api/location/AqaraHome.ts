import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraLocation } from "./AqaraLocation"
import { AqaraRoom } from "./AqaraRoom"
export { AqaraHome };

class AqaraHome extends AqaraLocation {
    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: Map<string, any> | null = null) {
        super(api_instance, positionId, data)
    }

    GetRooms() {
        let kwargs = new Map<string, string | number>([["parentPositionId", super.positionId]])
        kwargs["pageNum"] = 1
        kwargs["pageSize"] = super.page_size
 
        let intent = super.api.makePostData("query.position.info", kwargs)
        let room_info = super.api.makeApiRequest(intent)
        if (room_info["code"] == 0) {
            throw Error("no rooms in Home")
        }

        let rooms = new Array<AqaraRoom>()
        room_info["result"]["data"].foreach(roomData => {
            rooms.push(new AqaraRoom(super.api,  roomData))
        })
        return rooms
    }
}