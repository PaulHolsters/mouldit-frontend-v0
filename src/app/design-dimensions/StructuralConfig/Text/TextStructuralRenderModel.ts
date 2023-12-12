import {ComponentStructuralRenderModel} from "../ComponentStructuralRenderModel";

export class TextStructuralRenderModel extends ComponentStructuralRenderModel{
  public text:string|null=null
  public setProperty(propName: string, value: any|undefined): void {
    if (Reflect.has(this, propName)){
      Reflect.set(this, propName, value)
    } else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type PositioningComponentPropsModel')
  }

}
