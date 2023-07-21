import {ConceptConfigModel} from "../../models/Data/ConceptConfigModel";
import {AttributeConfigModel} from "../../models/Data/AttributeConfigModel";
import {TextAttributeConfigModel} from "../../models/Data/TextAttributeConfigModel";
import {RestrictionType} from "../../enums/restrictionType.enum";
import {IconType} from "../../enums/iconType.enum";
import {IconPositionType} from "../../enums/iconPositionType.enum";
import {InputFontSizeType} from "../../enums/inputFontSizeType.enum";
import {NoValueType} from "../../enums/no_value_type";
import {NumberAttributeConfigModel} from "../../models/Data/NumberAttributeConfigModel";
import {NumberInputModeType} from "../../enums/numberInputModeType.enum";
import {LocaleType} from "../../enums/localeType.enum";
import {CurrencyType} from "../../enums/currencyType.enum";
import {CurrencyDisplayType} from "../../enums/currencyDisplayType.enum";
import {ButtonClassType} from "../../enums/buttonClassType.enum";
import {ButtonLayoutType} from "../../enums/buttonLayoutType.enum";
import {RadioAttributeConfigModel} from "../../models/Data/RadioAttributeConfigModel";
import {MultiSelectAttributeConfigModel} from "../../models/Data/MultiSelectAttributeConfigModel";
import {FunctionType} from "../../enums/functionTypes.enum";
import {TableColumnAttributeConfigModel} from "../../models/Data/TableColumnAttributeConfigModel";

export const conceptModel = new ConceptConfigModel(
  'product',
  [
    new AttributeConfigModel(
      'name',
      undefined,
      undefined,
      false,
      false,
      new TextAttributeConfigModel(
        RestrictionType.Alphanumeric,
        RestrictionType.NA,
        IconType.Check,
        IconPositionType.Left,
        InputFontSizeType.Large,
        NoValueType.NVY),
      undefined,
      undefined,
      undefined,
      new TableColumnAttributeConfigModel(
        true,
        NoValueType.DBI
      ),
      undefined, 'Product naam', 'Geef een adequate naam'
    ),
    new AttributeConfigModel(
      'category',
      undefined,
      undefined,
      false,
      false,
      undefined,
      undefined,
      new RadioAttributeConfigModel(
        NoValueType.DBI,
        NoValueType.DBI,
        NoValueType.NVY,
        [FunctionType.ToLowerCase,FunctionType.CreateSpaces,FunctionType.CapitalizeFirstLetter]
      ),undefined,      new TableColumnAttributeConfigModel(
        false,
        NoValueType.DBI
      ),undefined,'Categorie','Selecteer één van de mogelijke categorieën',undefined
    )
    ,
    new AttributeConfigModel(
      'price',
      undefined,
      undefined,
      false,
      false,
      undefined,
      new NumberAttributeConfigModel(
        true,
        true,
        1,
        NumberInputModeType.Currency, LocaleType.nl_NL, CurrencyType.EUR, CurrencyDisplayType.CODE, undefined, undefined,
        undefined, undefined, ButtonClassType.Success,
        ButtonClassType.Primary, IconType.Plus, IconType.Min, undefined, undefined, ButtonLayoutType.Stacked, NoValueType.NVY),
      undefined,undefined,      new TableColumnAttributeConfigModel(
        false,
        NoValueType.DBI
      ),undefined,
      'Basisprijs',
      'Geef een getal in tussen -445 en 10'),
    new AttributeConfigModel(
      'specifications',
      undefined,
      undefined,
      false,
      false,
      undefined,
      undefined,
      undefined,
      // todo ervoor zorgen dat je voor optionLabel ook een datamanipulatie kan doen
      new MultiSelectAttributeConfigModel(NoValueType.DBI, NoValueType.DBI,undefined,'name'),
      new TableColumnAttributeConfigModel(
        true,
        NoValueType.DBI
      ),
      new ConceptConfigModel('specification',[
        new AttributeConfigModel(
          'name',
          undefined,
          undefined,
          false,
          false,
          new TextAttributeConfigModel(RestrictionType.Alphanumeric, RestrictionType.NA, IconType.Check, IconPositionType.Left,
            InputFontSizeType.Large, NoValueType.NVY),
          undefined, undefined,undefined,undefined,undefined, 'Specificatie', 'Geef een adequate naam'
        )
      ]),
      'Product specificaties',
      'Selecteer alle eigenschappen van toepassing op het product'
    )
  ])
