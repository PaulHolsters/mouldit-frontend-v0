import {NoValueType} from "../../../enums/NoValueTypes.enum";
import {ComponentModelType, isNoValueType} from "../../../types/union-types";

export class ToastContentInjectionConfigModel {
  constructor( public templateComponent: ComponentModelType|NoValueType.NO_VALUE_YET=NoValueType.NO_VALUE_YET) {
  }
  setTemplateComponent(templateComponent: ComponentModelType|NoValueType.NO_VALUE_YET){
    this.templateComponent=templateComponent
    return this
  }
  getComponents():ComponentModelType[]{
    const arr = []
    if(!isNoValueType(this.templateComponent)){
      arr.push(this.templateComponent)
    }
    return arr
  }
}
