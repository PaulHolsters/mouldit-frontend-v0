import {PaddingType} from "../../enums/paddingType.enum";
import {MarginType} from "../../enums/marginType.enum";
import {FontWeightType} from "../../enums/fontWeightType.enum";
import {TextColorType} from "../../enums/textColorType.enum";
import {TextDecorationType} from "../../enums/textDecorationType.enum";
import {FontSizeType} from "../../enums/fontSizeType.enum";
import {FontStyleType} from "../../enums/fontStyleType.enum";
import {BorderModel} from "../BorderModel";
import {BackgroundColorType} from "../../enums/backgroundColorType.enum";
import {TableStylingType} from "../../enums/tableStylingType.enum";
import {NoValueType} from "../../enums/no_value_type";

export class StylingComponentPropsModel {
constructor(
  public backgroundColor:BackgroundColorType|NoValueType.NA,
  public border:BorderModel|NoValueType.NA,
  public padding:PaddingType|NoValueType.NA,
  public margin:MarginType|NoValueType.NA,
  public fontWeight: FontWeightType|NoValueType.NA,
  public textColor: TextColorType|NoValueType.NA,
  public textDecoration: TextDecorationType|NoValueType.NA,
  public fontSize: FontSizeType|NoValueType.NA,
  public fontStyle?: FontStyleType|NoValueType.NA,
  public tableStyle?: TableStylingType|NoValueType.NA

  ) {
}
}
