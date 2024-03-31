import { AqaraIRDevice } from "../device/aqaraIRDevice"
import { AqaraAPI } from "./../core/aqaraAPI"
import { AqaraHub } from "./../device/aqaraHubDevice"
import { AqaraLocation } from "./AqaraLocation"
import { AqaraRoom } from "./AqaraRoom"

export class AqaraHome extends AqaraLocation {
    constructor(api_instance: AqaraAPI, positionId: string | null = null, data: Map<string, any> | null = null) {
        super(api_instance, positionId, data)
    }

    getRooms(): Array<AqaraRoom> {
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

    getDevices(): Array<AqaraIRDevice> {
        let rooms: Array<AqaraRoom> = this.getRooms()
        let devices: Array<AqaraIRDevice> = new Array<AqaraIRDevice>()
        rooms.forEach(room => room.getDevices().forEach(device => devices.push(device)))
        return devices
    }

    findHub() {
        let result = Array<AqaraHub>()
        let rooms = this.getRooms()
        for (let room of rooms) {
            let currHubs = room.findHub()
            if (currHubs.length != 0) {
                currHubs.forEach(hub => { result.push(hub) })
            }
        }
        return result
    }
}