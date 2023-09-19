import {ResponsiveChildLayoutConfigModel} from "../../models/Layout/ResponsiveContainerChildLayoutConfigModel";
import {ChildLayoutConfigModel} from "../../models/Layout/TableLayoutConfigModel";
import {HorizontalLayoutConfigPropsModel} from "../../models/Layout/HorizontalLayoutConfigPropsModel";
import {AxisConfigType} from "../../enums/axisConfigTypes.enum";
import {CrossAxisHorizontalPositioningConfigType} from "../../enums/HorizontalColumnLayoutConfigTypes.enum";
import {WidthConfigModel} from "../../models/Dimensioning/WidthConfigModel";
import {FixedDimensioningConfigModel} from "../../models/Dimensioning/NonCalculatedDimensioningConfigModel";
import {DimensionValueConfigType} from "../../enums/dimensionValueConfigTypes.enum";
import {DimensionUnitConfigType} from "../../enums/dimensionUnitConfigTypes.enum";
import {DynamicDimensionValueConfigType} from "../../enums/DynamicDimensionValueConfigTypes.enum";
import {
  CrossAxisHorizontalLanesPositioningConfigType
} from "../../enums/columnPositioningConfigTypes.enum";
import {VerticalLayoutConfigPropsModel} from "../../models/Layout/VerticalLayoutConfigPropsModel";
import {MainAxisVerticalPositioningConfigType} from "../../enums/VerticalColumnLayoutConfigTypes.enum";
import {HeightValueConfigType} from "../../enums/HeightValueConfigTypes.enum";
import {CrossAxisVerticalLanesPositioningConfigType} from "../../enums/rowPositioningConfigTypes.enum";

export const formLayout = new ResponsiveChildLayoutConfigModel(
  new ChildLayoutConfigModel(
    new HorizontalLayoutConfigPropsModel(
      AxisConfigType.Cross,
      undefined,
      false,
      CrossAxisHorizontalPositioningConfigType.Left,
      new WidthConfigModel(
        new FixedDimensioningConfigModel(
          DimensionValueConfigType.Hardcoded,
          100,
          DimensionUnitConfigType.Percentage
        ),
        DynamicDimensionValueConfigType.NA
      ),
      CrossAxisHorizontalLanesPositioningConfigType.Left
    ),
    new VerticalLayoutConfigPropsModel(
      AxisConfigType.Main,
      false,
      false,
      MainAxisVerticalPositioningConfigType.Top,
      // todo fix bug dit is automatisch 100% hoog terwijl dat niet mag eerder auto!
      HeightValueConfigType.NC,
      CrossAxisVerticalLanesPositioningConfigType.NA
    )
  )
)
