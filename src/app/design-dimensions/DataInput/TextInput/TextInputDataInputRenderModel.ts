import {ZeroValueType} from "../../../enums/zeroValueTypes.enum";
import {RestrictionType} from "../../../enums/restrictionType.enum";
export class TextInputDataInputRenderModel {
  public restrictions:RestrictionType[]|RegExp|ZeroValueType.NotConfigured|undefined=undefined
  constructor() {
  }
  public setProperty(propName: string, value: string): void {
    if (Reflect.has(this, propName)) Reflect.set(this, propName, value)
    else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type TableRenderModel')
  }

}