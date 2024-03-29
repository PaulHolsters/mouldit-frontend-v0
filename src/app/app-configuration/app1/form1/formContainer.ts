import {ComponentModel} from "../../models/ComponentModel";
import {ComponentType} from "../../../enums/componentTypes.enum";
import {formLayout} from "./formLayout";
import {ResponsiveDimensioningConfigModel} from "../../models/Size/ResponsiveSizeConfigModel";
import {DimensioningConfigModel} from "../../models/Size/IconStylingConfigModel";
import {FixedDimensioningConfigModel} from "../../models/Size/NonCalculatedSizeConfigModel";
import {DimensionValueConfigType} from "../../../enums/sizeValueConfigTypes.enum";
import {DimensionUnitConfigType} from "../../../enums/sizeUnitConfigTypes.enum";
import {DynamicDimensionValueConfigType} from "../../../enums/DynamicDimensionValueConfigTypes.enum";
import {WidthConfigModel} from "../../models/Size/WidthConfigModel";
import {ResponsiveVisibilityConfigModel} from "../../models/Visibility/ResponsiveSpacingConfigModel";
import {formControl1} from "./formControl1";
import {formControl2} from "./formControl2";
import {ResponsiveAttributesConfigModel} from "../../models/component-specific-config/ResponsiveTableConfigModel";
import {VisibilityConfigModel} from "../../models/Visibility/SpacingConfigModel";
import {conceptModel} from "../app2/root/appDataModel";
import {formControl3} from "./formControl3";
import {formControl4} from "./formControl4";
import {ResponsiveOverflowConfigModel} from "../../models/Overflow/self/ResponsiveOverflowConfigModel";
import {OverflowConfigPropsModel} from "../../models/Overflow/self/OverflowConfigPropsModel";
import {OverflowValueConfigType} from "../../../enums/overflowValueConfigTypes.enum";
import {HeightValueConfigType} from "../../enums/HeightValueConfigTypes.enum";
import {buttons} from "./buttons";
import {HeightConfigModel} from "../../models/Size/HeightConfigModel";

export const formContainer = new ComponentModel(
  'form-container',
  ComponentType.Container,
  formLayout,
  undefined,
  new ResponsiveDimensioningConfigModel(new DimensioningConfigModel(
    new HeightConfigModel(new FixedDimensioningConfigModel(DimensionValueConfigType.Hardcoded,100,DimensionUnitConfigType.Percentage),DynamicDimensionValueConfigType.NC),
    new WidthConfigModel(new FixedDimensioningConfigModel(
      DimensionValueConfigType.Hardcoded, 100, DimensionUnitConfigType.Percentage
    ), DynamicDimensionValueConfigType.NC)
  )),
  undefined,
  new ResponsiveVisibilityConfigModel(new VisibilityConfigModel()),
  undefined,
  // new ResponsiveOverflowConfigModel(new OverflowConfigPropsModel(OverflowValueConfigType.Auto,OverflowValueConfigType.NC)),
  [
/*    formControl1,
    formControl2,
    formControl3,
    formControl4,*/
    buttons
  ],
  undefined,
  conceptModel
)
