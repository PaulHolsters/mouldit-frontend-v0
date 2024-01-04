import {ActionIdType, ComponentNameType, FormTargetType} from "../types/type-aliases";
import {NoValueType} from "../enums/NoValueTypes.enum";
import {VerbType} from "../enums/VerbTypes.enum";

export class ServerAction {
  public constructor(
    public url:string,
    public verb:VerbType,
    public target?:
      ComponentNameType|
      FormTargetType|
      NoValueType.CALCULATED_BY_ENGINE|
      NoValueType.NO_VALUE_ALLOWED,
    public body?:string|string[]|[string,string]|[string,string][],
    public params?:string|string[]|[string,string]|[string,string][],
    // todo later ook options toevoegen voor bv. header values
    public id?:ActionIdType,

  ) {
  }
}
