import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {Datalink} from "./datalink";

export class ComponentConfigModel {
  private propsByData: [PropertyName, Datalink, Function[]][] = []
  private propsByDataObject: [PropertyName, Datalink, Function[]][] = []

  public setPropertyByData(prop: PropertyName, link: Datalink, pipe?: Function[]) {
    this.propsByData.push([prop,link,pipe ? pipe:[]])
    return this
  }
  public setPropertyByDataObject(prop: PropertyName, link: Datalink, pipe?: Function[]) {
    this.propsByDataObject.push([prop,link,pipe ? pipe:[]])
    return this
  }
}
