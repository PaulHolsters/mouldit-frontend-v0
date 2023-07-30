import {Component} from "./Component";
import {ComponentModel} from "../models/ComponentModel";
import {NoValueType} from "../enums/no_value_type";
import {ComponentDimensionValueConfigType} from "../enums/componentDimensionValueConfigTypes.enum";

export abstract class Form extends Component{
  public static content:ComponentModel|undefined = undefined
  public static calcHeight:string|undefined = undefined
  public static calcWidth:string|undefined = undefined
  public static width:string|undefined = undefined
  public static height:string|undefined = undefined
  public static conceptId:string|NoValueType.NA=NoValueType.NA
  public static grow: number|undefined| ComponentDimensionValueConfigType.Parent = undefined
  public static shrink: number|undefined| ComponentDimensionValueConfigType.Parent = undefined
  public static visible: boolean|undefined = undefined
  public static holdSpace: boolean|undefined = undefined
}