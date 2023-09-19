import {ComponentModel} from "../../ComponentModel";
import {ZeroValueType} from "../../../enums/zeroValueTypes.enum";
import {TableColumnModel} from "../../component-specific-config/table/TableColumnModel";

export class TableContentInjectionRenderModel {
  public columnHeaderComponents: ComponentModel[]|ZeroValueType.NotConfigured|undefined=undefined
  public footer: ComponentModel|ZeroValueType.NotConfigured|undefined=undefined
  public caption: ComponentModel|ZeroValueType.NotConfigured|undefined=undefined
  public extraColumns:TableColumnModel[]|ZeroValueType.NotConfigured|undefined=undefined
  constructor() {
  }
  public setProperty(propName: string, value: string): void {
    if (Reflect.has(this, propName)) Reflect.set(this, propName, value)
    else throw new Error('cannot set property ' + propName + ' because it does not exist on the object of type TableRenderModel')
  }

}