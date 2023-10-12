import {IconType} from "../../../enums/iconType.enum";

export class IconStructuralRenderModel {
  public icon:IconType|undefined
  public spin:boolean|undefined
  constructor() {
  }
  public setProperty(propName: string, value: any|undefined): void {
    if (Reflect.has(this, propName))
      Reflect.set(this, propName, value)
    else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type PositioningComponentPropsModel')
  }

}
