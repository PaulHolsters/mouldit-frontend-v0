import {ComponentI} from "../../Interfaces/ComponentI";
import {ResponsiveVisibilityConfigModel} from "../../design-dimensions/Visibility/ResponsiveVisibilityConfigModel";
import {ResponsiveSizeConfigModel} from "../../design-dimensions/Size/ResponsiveSizeConfigModel";
import {ResponsiveOverflowConfigModel} from "../../design-dimensions/Overflow/ResponsiveOverflowConfigModel";
import {ResponsiveSpacingConfigModel} from "../../design-dimensions/Spacing/ResponsiveSpacingConfigModel";
import {
  ResponsiveIndividualLayoutConfigModel
} from "../../design-dimensions/IndividualLayout/ResponsiveIndividualLayoutConfigModel";
import {ComponentModelType} from "../../types/union-types";
import {ComponentType} from "../../enums/componentTypes.enum";
import {
  ResponsiveContentInjectionToastConfigModel
} from "../../design-dimensions/ContentInjection/toast/ResponsiveContentInjectionToastConfigModel";
import {
  ResponsiveToastLayoutConfigModel
} from "../../design-dimensions/ComponentSpecificLayout/Toast/ResponsiveToastLayoutConfigModel";
import {
  ResponsiveStructuralToastConfigModel
} from "../../design-dimensions/StructuralConfig/toast/ResponsiveStructuralToastConfigModel";
import {
  ToastContentInjectionConfigModel
} from "../../design-dimensions/ContentInjection/toast/ToastContentInjectionConfigModel";
export class Toast implements ComponentI<
  ResponsiveContentInjectionToastConfigModel,
  ResponsiveStructuralToastConfigModel,
  undefined,
  ResponsiveToastLayoutConfigModel,
  undefined,
  undefined>{
  constructor(name:string) {
    this.name = name
  }
  name:string
  type=ComponentType.Toast
  spacing = new ResponsiveSpacingConfigModel()
  setSpacing(spacing:ResponsiveSpacingConfigModel){
    this.spacing = spacing
    return this
  }
  visibility = new ResponsiveVisibilityConfigModel()
  setVisibility(visibility:ResponsiveVisibilityConfigModel){
    this.visibility = visibility
    return this
  }
  size = new ResponsiveSizeConfigModel()
  setSize(size:ResponsiveSizeConfigModel){
    this.size = size
    return this
  }
  overflow = new ResponsiveOverflowConfigModel()
  setOverflow(overflow:ResponsiveOverflowConfigModel){
    this.overflow = overflow
    return this
  }
  individualLayout = new ResponsiveIndividualLayoutConfigModel()
  setIndividualLayout(il:ResponsiveIndividualLayoutConfigModel){
    this.individualLayout=il
    return this
  }
  componentSpecificLayout = new ResponsiveToastLayoutConfigModel()
  setComponentSpecificLayout(csl: ResponsiveToastLayoutConfigModel): ComponentModelType {
    this.componentSpecificLayout = csl
    return this
  }
  setContentInjection(ci:ResponsiveContentInjectionToastConfigModel){
    this.contentInjection=ci
    return this
  }
  contentInjection = new ResponsiveContentInjectionToastConfigModel(new ToastContentInjectionConfigModel())
  setStructural(str: ResponsiveStructuralToastConfigModel): ComponentModelType {
    this.structural = str
    return this
  }
  structural= new ResponsiveStructuralToastConfigModel()

  setStyling:undefined
  styling:undefined
  dataRepresentation: undefined
  setDataRepresentation: undefined
  clientData = undefined
  setClientData = undefined
  dataInput = undefined
  setDataInput = undefined
  children=undefined
  setChildren=undefined
}
