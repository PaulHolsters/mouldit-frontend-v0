import {ResponsiveDimensioningConfigModel} from "../design-dimensions/Dimensioning/ResponsiveDimensioningConfigModel";
import {ResponsiveVisibilityConfigModel} from "../design-dimensions/Visibility/ResponsiveVisibilityConfigModel";
import {ResponsiveChildLayoutConfigModel} from "../design-dimensions/ChildLayout/ResponsiveChildLayoutConfigModel";
import {ContainerModel} from "../components/container/ContainerModel";
import {ResponsiveTableConfigModel} from "../design-dimensions/component-specific-config/table/ResponsiveTableConfigModel";
import {ResponsiveOverflowConfigModel} from "../design-dimensions/Overflow/self/ResponsiveOverflowConfigModel";
import {ResponsivePositioningConfigModel} from "../design-dimensions/Positioning/self/ResponsivePositioningConfigModel";
import {
  ResponsiveContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/ResponsiveContentInjectionConfigModel";
import {ResponsiveStylingConfigModel} from "../design-dimensions/Styling/ResponsiveStylingConfigModel";
import {
  ResponsiveDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/ResponsiveDataRepresentationConfigModel";
import {ResponsiveDataInputConfigModel} from "../design-dimensions/DataInput/ResponsiveDataInputConfigModel";
import {ResponsiveImageConfigModel} from "../design-dimensions/component-specific-config/image/ResponsiveImageConfigModel";
import {
  ResponsiveMenubarConfigModel
} from "../design-dimensions/component-specific-config/menubar/ResponsiveMenubarConfigModel";
import {ResponsiveConfirmPopupConfigModel} from "../design-dimensions/component-specific-config/confirm-popup/ResponsiveConfirmPopupConfigModel";
import {
  ResponsiveDialogConfigModel
} from "../design-dimensions/component-specific-config/dialog/ResponsiveDialogConfigModel";
import {ResponsiveIconConfigModel} from "../design-dimensions/icon-config/ResponsiveIconConfigModel";
import {ResponsiveLabelConfigModel} from "../design-dimensions/label-config/ResponsiveLabelConfigModel";
import {
  ResponsiveComponentSpecificConfigModel
} from "../design-dimensions/component-specific-config/ResponsiveComponentSpecificConfigModel";
import {
  ResponsiveMenubarContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/menubar/ResponsiveMenubarContentInjectionConfigModel";
import {
  ResponsiveTableContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/table/ResponsiveTableContentInjectionConfigModel";
import {
  ResponsiveDialogContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/dialog/ResponsiveDialogContentInjectionConfigModel";

export type ResponsiveConfigModelType =
  ResponsiveDimensioningConfigModel |
  ResponsiveVisibilityConfigModel |
  ResponsiveChildLayoutConfigModel |
  ResponsiveTableConfigModel |
  ResponsiveImageConfigModel |
  ResponsiveMenubarConfigModel |
  ResponsiveConfirmPopupConfigModel |
  ResponsiveDialogConfigModel |
  ResponsiveIconConfigModel |
  ResponsiveLabelConfigModel |
  ResponsiveComponentSpecificConfigModel|
  ResponsiveMenubarContentInjectionConfigModel |
  ResponsiveTableContentInjectionConfigModel |
  ResponsiveDialogContentInjectionConfigModel|

  ResponsiveOverflowConfigModel |
  ResponsivePositioningConfigModel |
  ResponsiveContentInjectionConfigModel |
  ResponsiveStylingConfigModel |
  ResponsiveDataRepresentationConfigModel |
  ResponsiveDataInputConfigModel

export type ComponentModelType = ContainerModel
