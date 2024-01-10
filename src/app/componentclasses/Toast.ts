import {Component} from "./Component";
import {ParentConfigType} from "../enums/ParentConfigTypes.enum";
import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {Datalink} from "../design-dimensions/datalink";
import {CursorValues} from "../enums/cursorValues.enum";
import {ComponentModelType} from "../types/union-types";

export abstract class Toast extends Component{
  public static calcHeight: string|null=null
  public static calcWidth: string|null=null
  public static width:string|null=null
  public static height:string|null=null
  public static grow: number| ParentConfigType.grow|null=null
  public static shrink: number| ParentConfigType.shrink|null=null
  public static visible: boolean|null=null
  public static holdSpace: boolean|null=null
  public static display: string|null=null
  public static padding: string|null=null
  public static margin: string|null=null

  public static templateComponent:ComponentModelType|null=null

  public static data: any|null=null
  public static hardCodedData: any|null=null
  public static propsByData:[PropertyName,Datalink,Function[]]|null=null
  public static cursor:CursorValues|null=null

}
