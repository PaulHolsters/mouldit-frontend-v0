import {ComponentModel} from "../../../design-dimensions/ComponentModel";
import {ComponentI} from "../../../Interfaces/ComponentI";
import {ResponsiveSpacingConfigModel} from "../../../design-dimensions/Spacing/ResponsiveSpacingConfigModel";
import {ResponsiveVisibilityConfigModel} from "../../../design-dimensions/Visibility/ResponsiveVisibilityConfigModel";
import {ComponentModelType} from "../../../types/union-types";
import {ResponsiveSizeConfigModel} from "../../../design-dimensions/Size/ResponsiveSizeConfigModel";
import {ResponsiveOverflowConfigModel} from "../../../design-dimensions/Overflow/ResponsiveOverflowConfigModel";
import {
  ResponsiveIndividualLayoutConfigModel
} from "../../../design-dimensions/IndividualLayout/ResponsiveIndividualLayoutConfigModel";
import {
  ResponsiveDataInputRadioButtonGroupConfigModel
} from "../../../design-dimensions/DataInput/RadioButtonGroup/ResponsiveDataInputRadioButtonGroupConfigModel";
import {
  ResponsiveDataRepresentationRadioButtonGroupConfigModel
} from "../../../design-dimensions/DataRepresentation/RadioButtonGroup/ResponsiveDataRepresentationRadioButtonGroupConfigModel";
import {ClientDataConfigModel} from "../../../design-dimensions/ClientData/ClientDataConfigModel";
import {NoValueYet} from "../../../types/type-aliases";

export class RadioButtonGroup extends ComponentModel
  implements ComponentI<undefined,undefined,undefined,undefined,
    ResponsiveDataInputRadioButtonGroupConfigModel,ResponsiveDataRepresentationRadioButtonGroupConfigModel>{
  // todo add conditional typing : prop required => set required too
  // todo zorg dat de set method onmiddellijk een bepaald scherm kan targetten
  name:string
  spacing:ResponsiveSpacingConfigModel = new ResponsiveSpacingConfigModel()
  setSpacing(spacing:ResponsiveSpacingConfigModel){
    this.spacing = spacing
    return this
  }
  visibility: ResponsiveVisibilityConfigModel = new ResponsiveVisibilityConfigModel()
  setVisibility(visibility:ResponsiveVisibilityConfigModel){
    this.visibility = visibility
    return this
  }
  children = undefined
  setChildren = undefined
  size: ResponsiveSizeConfigModel= new ResponsiveSizeConfigModel()
  setSize(size:ResponsiveSizeConfigModel){
    this.size = size
    return this
  }
  overflow: ResponsiveOverflowConfigModel = new ResponsiveOverflowConfigModel()
  setOverflow(overflow:ResponsiveOverflowConfigModel){
    this.overflow = overflow
    return this
  }
  constructor(name:string) {
    super()
    this.name = name
  }
  clientData: ClientDataConfigModel|NoValueYet=undefined
  setClientData(cd:ClientDataConfigModel|NoValueYet){
    this.clientData=cd
    return this
  }
  componentSpecificLayout=undefined
  setComponentSpecificLayout=undefined
  contentInjection = undefined
  dataInput = new ResponsiveDataInputRadioButtonGroupConfigModel()
  setDataInput(di:ResponsiveDataInputRadioButtonGroupConfigModel){
    this.dataInput = di
    return this
  }
  dataRepresentation = new ResponsiveDataRepresentationRadioButtonGroupConfigModel()
  setDataRepresentation(dr:ResponsiveDataRepresentationRadioButtonGroupConfigModel){
    this.dataRepresentation = dr
    return this
  }
  individualLayout = new  ResponsiveIndividualLayoutConfigModel()
  setIndividualLayout(il: ResponsiveIndividualLayoutConfigModel): ComponentModelType {
    this.individualLayout = il
    return this
  }
  setContentInjection = undefined
  setStructural = undefined
  setStyling = undefined
  structural = undefined
  styling = undefined
}