import {Component} from "./Component";
import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {Datalink} from "../design-dimensions/datalink";
import {ComponentModelType} from "../types/union-types";
import {Message} from "primeng/api";
import {PositionType} from "../enums/PositionType.enum";

export abstract class Toast extends Component{
  public static visible: boolean|null=null
  public static holdSpace: boolean|null=null
  public static templateComponent:ComponentModelType|null=null
  public static propsByData:[PropertyName,Datalink,Function[]]|null=null
  public static message:Message|null=null
  public static position:PositionType|null=null
  public static life:Number|null=null
  // todo width en height en calcwidth en calc height => responsive behaviour system
}
