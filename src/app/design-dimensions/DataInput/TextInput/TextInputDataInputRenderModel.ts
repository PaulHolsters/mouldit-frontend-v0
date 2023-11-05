import {RestrictionType} from "../../../enums/restrictionType.enum";
import {isNoValueType} from "../../../types/union-types";
export class TextInputDataInputRenderModel {
  public restrictions:RestrictionType[]|RegExp|null=null
  public disabled: boolean | null=null
  constructor() {
  }
  public setProperty(propName: string, value: string): void {
    if (Reflect.has(this, propName)){
      if(!isNoValueType(value)) Reflect.set(this, propName, value)
    } else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type TableStructuralRenderModel')
  }

}
