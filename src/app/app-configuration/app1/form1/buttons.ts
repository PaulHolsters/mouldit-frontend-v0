import {ComponentType} from "../../../enums/componentTypes.enum";
import {ResponsiveAttributesConfigModel} from "../../models/component-specific-config/ResponsiveTableConfigModel";
import {ComponentModel} from "../../models/ComponentModel";
import {ResponsiveChildLayoutConfigModel} from "../../models/Layout/ResponsiveContainerChildLayoutConfigModel";
import {ChildLayoutConfigModel} from "../../models/Layout/ToastLayoutConfigModel";
import {HorizontalLayoutConfigPropsModel} from "../../models/Layout/HorizontalLayoutConfigPropsModel";
import {AxisConfigType} from "../../../enums/axisConfigTypes.enum";
import {CrossAxisHorizontalPositioningConfigType} from "../../../enums/HorizontalColumnLayoutConfigTypes.enum";
import {WidthConfigModel} from "../../models/Size/WidthConfigModel";
import {FixedDimensioningConfigModel} from "../../models/Size/NonCalculatedSizeConfigModel";
import {DimensionValueConfigType} from "../../../enums/sizeValueConfigTypes.enum";
import {DimensionUnitConfigType} from "../../../enums/sizeUnitConfigTypes.enum";
import {DynamicDimensionValueConfigType} from "../../../enums/DynamicDimensionValueConfigTypes.enum";
import {
  CrossAxisHorizontalLanesPositioningConfigType
} from "../../../enums/columnPositioningConfigTypes.enum";
import {VerticalLayoutConfigPropsModel} from "../../models/Layout/VerticalLayoutConfigPropsModel";
import {MainAxisVerticalPositioningConfigType} from "../../../enums/VerticalColumnLayoutConfigTypes.enum";
import {HeightValueConfigType} from "../../enums/HeightValueConfigTypes.enum";
import {
  CrossAxisVerticalLanesPositioningConfigType
} from "../../../enums/rowPositioningConfigTypes.enum";
import {ResponsiveDimensioningConfigModel} from "../../models/Size/ResponsiveSizeConfigModel";
import {DimensioningConfigModel} from "../../models/Size/IconStylingConfigModel";
import {ResponsiveVisibilityConfigModel} from "../../models/Visibility/ResponsiveSpacingConfigModel";
import {VisibilityConfigModel} from "../../models/Visibility/SpacingConfigModel";
import {AttributesConfigPropsModel} from "../../models/component-specific-config/AttributesConfigPropsModel";
import {NoValueType} from "../../enums/no_value_type";

export const buttons= new ComponentModel(
  'buttons',
  ComponentType.Container,
  new ResponsiveChildLayoutConfigModel(
    new ChildLayoutConfigModel(
      new HorizontalLayoutConfigPropsModel(
        AxisConfigType.Cross, true, false, CrossAxisHorizontalPositioningConfigType.Center,
        new WidthConfigModel(new FixedDimensioningConfigModel(
          DimensionValueConfigType.Hardcoded,100,DimensionUnitConfigType.Percentage
        ),DynamicDimensionValueConfigType.NC),
        CrossAxisHorizontalLanesPositioningConfigType.Center),
      new VerticalLayoutConfigPropsModel(
        AxisConfigType.Main, undefined, false, MainAxisVerticalPositioningConfigType.Evenly,
        HeightValueConfigType.NC,
        CrossAxisVerticalLanesPositioningConfigType.NA)
    )
  ),
  undefined,
  new ResponsiveDimensioningConfigModel(new DimensioningConfigModel(
    HeightValueConfigType.NC,
    new WidthConfigModel(new FixedDimensioningConfigModel(
      DimensionValueConfigType.Hardcoded, 100, DimensionUnitConfigType.Percentage
    ), DynamicDimensionValueConfigType.NC)
  )),
  undefined,
  new ResponsiveVisibilityConfigModel(new VisibilityConfigModel()),
  undefined,
  [    {
    name:'filter-btn',
    type:ComponentType.Button,
    attributes: new ResponsiveAttributesConfigModel(new AttributesConfigPropsModel(NoValueType.NA,  NoValueType.NA, NoValueType.NA, NoValueType.NA,
      'Filter op kolom')),
    visibility: new ResponsiveVisibilityConfigModel(new VisibilityConfigModel())
  }],
  undefined,
  undefined)
