import { IRButton } from "../aqara_api/device/aqaraIRDevice"
import { AqaraIRDevice } from "../aqara_api/device/aqaraIRDevice"
import { AqaraAcDevice } from "../aqara_api/device/aqaraACDevice"
import { IRAccesory} from "../platformAccessory"
export class ButtonHandler {
    constructor(private readonly btnApi: IRButton, public readonly deviceApi: AqaraIRDevice) {
    }

    public async handlePressEvent(): Promise<number> {
        if (this.deviceApi instanceof AqaraAcDevice) {
            (this.deviceApi as AqaraAcDevice).pressButton(this.btnApi.irKeyId)
        } else {
            (this.deviceApi).pressButton(this.btnApi.irKeyId)
        }
        
        return 1
    }

    public async getName(): Promise<string> {
        return this.btnApi.name
    }
}