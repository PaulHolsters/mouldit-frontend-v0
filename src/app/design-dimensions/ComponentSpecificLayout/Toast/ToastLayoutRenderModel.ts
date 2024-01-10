import {ResponsiveTableLayoutType} from "../../../enums/responsiveTableLayoutType.enum";
import {PositionType} from "../../../enums/PositionType.enum";

export class ToastLayoutRenderModel {
  public position: PositionType|null=null
  constructor() {
  }
  public setProperty(propName: string, value: ResponsiveTableLayoutType|number): void {
    if (Reflect.has(this, propName)) Reflect.set(this, propName, value)
    else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type TableStructuralRenderModel')
  }

}
