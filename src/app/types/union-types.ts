import {Container} from "../components/container/Container";
import {
  ResponsiveStructuralButtonConfigModel
} from "../design-dimensions/StructuralConfig/button/ResponsiveStructuralButtonConfigModel";
import {
  ResponsiveStructuralImageConfigModel
} from "../design-dimensions/StructuralConfig/image/ResponsiveStructuralImageConfigModel";
import {
  ResponsiveStructuralConfirmPopupConfigModel
} from "../design-dimensions/StructuralConfig/confirm-popup/ResponsiveStructuralConfirmPopupConfigModel";
import {
  ResponsiveStructuralDialogConfigModel
} from "../design-dimensions/StructuralConfig/dialog/ResponsiveStructuralDialogConfigModel";
import {
  ResponsiveStructuralTableConfigModel
} from "../design-dimensions/StructuralConfig/table/ResponsiveStructuralTableConfigModel";
import {
  ResponsiveStructuralMenubarConfigModel
} from "../design-dimensions/StructuralConfig/menubar/ResponsiveStructuralMenubarConfigModel";
import {
  ResponsiveContainerChildLayoutConfigModel
} from "../design-dimensions/ComponentSpecificLayout/Container/ResponsiveContainerChildLayoutConfigModel";
import {
  ResponsiveTableLayoutConfigModel
} from "../design-dimensions/ComponentSpecificLayout/Table/ResponsiveTableLayoutConfigModel";
import {
  DialogContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/dialog/DialogContentInjectionConfigModel";
import {
  MenubarContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/menubar/MenubarContentInjectionConfigModel";
import {
  TableContentInjectionConfigModel
} from "../design-dimensions/ContentInjection/table/TableContentInjectionConfigModel";
import {
  TableContentInjectionRenderModel
} from "../design-dimensions/ContentInjection/table/TableContentInjectionRenderModel";
import {
  DialogContentInjectionRenderModel
} from "../design-dimensions/ContentInjection/dialog/DialogContentInjectionRenderModel";
import {
  MenubarContentInjectionRenderModel
} from "../design-dimensions/ContentInjection/menubar/MenubarContentInjectionRenderModel";
import {ChildLayoutConfigModel} from "../design-dimensions/ComponentSpecificLayout/Container/ChildLayoutConfigModel";
import {TableLayoutConfigModel} from "../design-dimensions/ComponentSpecificLayout/Table/TableLayoutConfigModel";
import {
  NumberInputDataInputConfigModel
} from "../design-dimensions/DataInput/NumberInput/NumberInputDataInputConfigModel";
import {TextInputDataInputConfigModel} from "../design-dimensions/DataInput/TextInput/TextInputDataInputConfigModel";
import {
  RadioButtonGroupDataInputConfigModel
} from "../design-dimensions/DataInput/RadioButtonGroup/RadioButtonGroupDataInputConfigModel";
import {
  MultiSelectDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/MultiSelect/MultiSelectDataRepresentationConfigModel";
import {
  NumberInputDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/NumberInput/NumberInputDataRepresentationConfigModel";
import {
  RadioButtonGroupDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/RadioButtonGroup/RadioButtonGroupDataRepresentationConfigModel";
import {
  TableDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/Table/TableDataRepresentationConfigModel";
import {
  TextInputDataRepresentationConfigModel
} from "../design-dimensions/DataRepresentation/TextInput/TextInputDataRepresentationConfigModel";
import {ButtonStructuralConfigModel} from "../design-dimensions/StructuralConfig/button/ButtonStructuralConfigModel";
import {
  ConfirmPopupStructuralConfigModel
} from "../design-dimensions/StructuralConfig/confirm-popup/ConfirmPopupStructuralConfigModel";
import {DialogStructuralConfigModel} from "../design-dimensions/StructuralConfig/dialog/DialogStructuralConfigModel";
import {ImageStructuralConfigModel} from "../design-dimensions/StructuralConfig/image/ImageStructuralConfigModel";
import {MenubarStructuralConfigModel} from "../design-dimensions/StructuralConfig/menubar/MenubarStructuralConfigModel";
import {TableStructuralConfigModel} from "../design-dimensions/StructuralConfig/table/TableStructuralConfigModel";
import {ButtonStylingConfigModel} from "../design-dimensions/Styling/button/ButtonStylingConfigModel";
import {TableStylingConfigModel} from "../design-dimensions/Styling/table/TableStylingConfigModel";
import {IndividualLayoutConfigModel} from "../design-dimensions/IndividualLayout/IndividualLayoutConfigModel";
import {OverflowConfigModel} from "../design-dimensions/Overflow/OverflowConfigModel";
import {SizeConfigModel} from "../design-dimensions/Size/SizeConfigModel";
import {SpacingConfigModel} from "../design-dimensions/Spacing/SpacingConfigModel";
import {VisibilityConfigModel} from "../design-dimensions/Visibility/VisibilityConfigModel";
import {
  TableDataRepresentationRenderModel
} from "../design-dimensions/DataRepresentation/Table/TableDataRepresentationRenderModel";
import {
  RadioButtonGroupDataInputRenderModel
} from "../design-dimensions/DataInput/RadioButtonGroup/RadioButtonGroupDataInputRenderModel";
import {OverflowRenderModel} from "../design-dimensions/Overflow/OverflowRenderModel";
import {VisibilityRenderModel} from "../design-dimensions/Visibility/VisibilityRenderModel";
import {TableStructuralRenderModel} from "../design-dimensions/StructuralConfig/table/TableStructuralRenderModel";
import {MenubarStructuralRenderModel} from "../design-dimensions/StructuralConfig/menubar/MenubarStructuralRenderModel";
import {TableLayoutRenderModel} from "../design-dimensions/ComponentSpecificLayout/Table/TableLayoutRenderModel";
import {
  RadioButtonGroupDataRepresentationRenderModel
} from "../design-dimensions/DataRepresentation/RadioButtonGroup/RadioButtonGroupDataRepresentationRenderModel";
import {ButtonStructuralRenderModel} from "../design-dimensions/StructuralConfig/button/ButtonStructuralRenderModel";
import {ChildLayoutRenderModel} from "../design-dimensions/ComponentSpecificLayout/Container/ChildLayoutRenderModel";
import {SpacingRenderModel} from "../design-dimensions/Spacing/SpacingRenderModel";
import {
  NumberInputDataRepresentationRenderModel
} from "../design-dimensions/DataRepresentation/NumberInput/NumberInputDataRepresentationRenderModel";
import {DialogStructuralRenderModel} from "../design-dimensions/StructuralConfig/dialog/DialogStructuralRenderModel";
import {IndividualLayoutRenderModel} from "../design-dimensions/IndividualLayout/IndividualLayoutRenderModel";
import {ImageStructuralRenderModel} from "../design-dimensions/StructuralConfig/image/ImageStructuralRenderModel";
import {TableStylingRenderModel} from "../design-dimensions/Styling/table/TableStylingRenderModel";
import {
  MultiSelectDataRepresentationRenderModel
} from "../design-dimensions/DataRepresentation/MultiSelect/MultiSelectDataRepresentationRenderModel";
import {SizeRenderModel} from "../design-dimensions/Size/SizeRenderModel";
import {
  NumberInputDataInputRenderModel
} from "../design-dimensions/DataInput/NumberInput/NumberInputDataInputRenderModel";
import {TextInputDataInputRenderModel} from "../design-dimensions/DataInput/TextInput/TextInputDataInputRenderModel";
import {
  TextInputDataRepresentationRenderModel
} from "../design-dimensions/DataRepresentation/TextInput/TextInputDataRepresentationRenderModel";
import {
  ConfirmPopupStructuralRenderModel
} from "../design-dimensions/StructuralConfig/confirm-popup/ConfirmPopupStructuralRenderModel";
import {ButtonStylingRenderModel} from "../design-dimensions/Styling/button/ButtonStylingRenderModel";
import {ResponsiveStylingTableConfigModel} from "../design-dimensions/Styling/table/ResponsiveStylingTableConfigModel";
import {
  ResponsiveStylingButtonConfigModel
} from "../design-dimensions/Styling/button/ResponsiveStylingButtonConfigModel";
import {
  ResponsiveDataRepresentationTableConfigModel
} from "../design-dimensions/DataRepresentation/Table/ResponsiveDataRepresentationTableConfigModel";
import {
  ResponsiveDataRepresentationMultiSelectConfigModel
} from "../design-dimensions/DataRepresentation/MultiSelect/ResponsiveDataRepresentationMultiSelectConfigModel";
import {
  ResponsiveDataRepresentationRadioButtonGroupConfigModel
} from "../design-dimensions/DataRepresentation/RadioButtonGroup/ResponsiveDataRepresentationRadioButtonGroupConfigModel";
import {
  ResponsiveDataRepresentationNumberInputConfigModel
} from "../design-dimensions/DataRepresentation/NumberInput/ResponsiveDataRepresentationNumberInputConfigModel";
import {
  ResponsiveDataRepresentationTextInputConfigModel
} from "../design-dimensions/DataRepresentation/TextInput/ResponsiveDataRepresentationTextInputConfigModel";
import {
  ResponsiveDataInputTextInputConfigModel
} from "../design-dimensions/DataInput/TextInput/ResponsiveDataInputTextInputConfigModel";
import {
  ResponsiveDataInputNumberInputConfigModel
} from "../design-dimensions/DataInput/NumberInput/ResponsiveDataInputNumberInputConfigModel";
import {
  ResponsiveDataInputRadioButtonGroupConfigModel
} from "../design-dimensions/DataInput/RadioButtonGroup/ResponsiveDataInputRadioButtonGroupConfigModel";
import {
  ResponsiveContentInjectionMenubarConfigModel
} from "../design-dimensions/ContentInjection/menubar/ResponsiveContentInjectionMenubarConfigModel";
import {
  ResponsiveContentInjectionTableConfigModel
} from "../design-dimensions/ContentInjection/table/ResponsiveContentInjectionTableConfigModel";
import {
  ResponsiveContentInjectionDialogConfigModel
} from "../design-dimensions/ContentInjection/dialog/ResponsiveContentInjectionDialogConfigModel";
import {
  ResponsiveStructuralIconConfigModel
} from "../design-dimensions/StructuralConfig/icon/ResponsiveStructuralIconConfigModel";
import {IconStructuralConfigModel} from "../design-dimensions/StructuralConfig/icon/IconStructuralConfigModel";

export type ContentInjectionConfigModelType =
  DialogContentInjectionConfigModel |
  MenubarContentInjectionConfigModel|
  TableContentInjectionConfigModel|never
export type ComponentSpecificLayoutConfigModelType =
  ChildLayoutConfigModel |
  TableLayoutConfigModel | never
export type DataInputConfigModelType =
  NumberInputDataInputConfigModel|
  TextInputDataInputConfigModel|
  RadioButtonGroupDataInputConfigModel | never
export type DataRepresentationConfigModelType =
  MultiSelectDataRepresentationConfigModel|
  NumberInputDataRepresentationConfigModel|
  RadioButtonGroupDataRepresentationConfigModel|
  TableDataRepresentationConfigModel|
  TextInputDataRepresentationConfigModel|never
export type StructuralConfigModelType =
  ButtonStructuralConfigModel|
  ConfirmPopupStructuralConfigModel|
  DialogStructuralConfigModel|
  ImageStructuralConfigModel|
  IconStructuralConfigModel|
  MenubarStructuralConfigModel|
  TableStructuralConfigModel|never
export type StylingConfigModelType =
  ButtonStylingConfigModel|
  TableStylingConfigModel|never

export type ConfigModelType =
  ContentInjectionConfigModelType|
  ComponentSpecificLayoutConfigModelType|
  DataInputConfigModelType|
  DataRepresentationConfigModelType|
  StructuralConfigModelType|
  StylingConfigModelType|
  IndividualLayoutConfigModel|
  OverflowConfigModel|
  SizeConfigModel|
  SpacingConfigModel|
  VisibilityConfigModel|never

export type ResponsiveStylingConfigModelType =
  ResponsiveStylingTableConfigModel|ResponsiveStylingButtonConfigModel|never
export type ResponsiveStructuralConfigModelType =
  ResponsiveStructuralTableConfigModel|
  ResponsiveStructuralButtonConfigModel|
  ResponsiveStructuralConfirmPopupConfigModel|
  ResponsiveStructuralDialogConfigModel|
  ResponsiveStructuralMenubarConfigModel|
  ResponsiveStructuralIconConfigModel|
  ResponsiveStructuralImageConfigModel|never
export type ResponsiveDataRepresentationConfigModelType =
  ResponsiveDataRepresentationTableConfigModel|
  ResponsiveDataRepresentationMultiSelectConfigModel|
  ResponsiveDataRepresentationRadioButtonGroupConfigModel|
  ResponsiveDataRepresentationNumberInputConfigModel|
  ResponsiveDataRepresentationTextInputConfigModel|never
export type ResponsiveDataInputConfigModelType =
  ResponsiveDataInputRadioButtonGroupConfigModel|
  ResponsiveDataInputNumberInputConfigModel|
  ResponsiveDataInputTextInputConfigModel|never
export type ResponsiveContentInjectionConfigModelType =
  ResponsiveContentInjectionDialogConfigModel|
  ResponsiveContentInjectionMenubarConfigModel|
  ResponsiveContentInjectionTableConfigModel|never
export type ResponsiveComponentSpecificLayoutConfigModelType =
  ResponsiveContainerChildLayoutConfigModel|
  ResponsiveTableLayoutConfigModel|never

export type ComponentModelType = Container
export type ScreenSizeType = 'smartphone'|'portraitTablet'|'tablet'|'laptop'|'high resolution'
