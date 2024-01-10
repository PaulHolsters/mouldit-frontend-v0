import {NoValueType} from "../../../enums/NoValueTypes.enum";
import {ComponentStructuralConfigModel} from "../ComponentStructuralConfigModel";

export class ToastStructuralConfigModel extends ComponentStructuralConfigModel{
  life:number|NoValueType.NO_VALUE_NEEDED=NoValueType.NO_VALUE_NEEDED
  setLife(life:number) {
    this.life = life
    return this
  }

}
