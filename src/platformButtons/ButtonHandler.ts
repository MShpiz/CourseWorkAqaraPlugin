import { IRButton } from "../aqara_api/device/aqaraIRDevice"
import { AqaraIRDevice } from "../aqara_api/device/aqaraIRDevice"
import { IRAccesory} from "../platformAccessory"
export class ButtonHandler {
    constructor(private readonly btnApi: IRButton, public readonly platformAccessory: IRAccesory) {
    }

    public async handlePressEvent(): Promise<number> {
        (this.platformAccessory.deviceApi as AqaraIRDevice).pressButton(this.btnApi.keyId)
        return 1
    }

    public async getName(): Promise<string> {
        return this.btnApi.name
    }
}