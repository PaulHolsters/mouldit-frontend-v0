import {ClientDataConfigModel} from "../../models/Data/ClientDataConfigModel";
import {AttributeConfigModel} from "../../models/data-representation/AttributeConfigModel";
import {TextAttributeConfigModel} from "../../models/data-representation/TextAttributeConfigModel";
import {RestrictionType} from "../../../enums/restrictionType.enum";
import {IconType} from "../../../enums/iconType.enum";
import {IconPositionType} from "../../../enums/iconPositionType.enum";
import {InputFontSizeType} from "../../../enums/inputFontSizeType.enum";
import {NoValueType} from "../../enums/no_value_type";

/*export const dataContainer = new ClientDataConfigModel(
  'product',
  [
    // todo bugfix: je kan nog geen id ophalen
    new AttributeConfigModel(
      'id',
      undefined,
      undefined,
      false,
      false,
      new TextAttributeConfigModel(RestrictionType.Alphanumeric, RestrictionType.NA, IconType.Check, IconPositionType.Left,
        InputFontSizeType.Large, NoValueType.NVY),
      undefined, undefined,undefined,undefined,undefined,
      'Id product', 'Geef het id van het product in dat u wenst te verwijderen'
    )
  ])*/
