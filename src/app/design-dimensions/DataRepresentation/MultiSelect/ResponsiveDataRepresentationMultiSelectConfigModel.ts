import {ResponsiveConfigModel} from "../../ResponsiveConfigModel";
import {MultiSelectDataRepresentationConfigModel} from "./MultiSelectDataRepresentationConfigModel";
import {ResponsiveConfigModelI} from "../../../Interfaces/ResponsiveConfigModelI";
import {MultiSelectDataRepresentationRenderModel} from "./MultiSelectDataRepresentationRenderModel";
import {DeterminedByEngine} from "../../../types/type-aliases";
export class ResponsiveDataRepresentationMultiSelectConfigModel extends ResponsiveConfigModel<MultiSelectDataRepresentationConfigModel>
  implements ResponsiveConfigModelI<MultiSelectDataRepresentationConfigModel>{
  public portraitTablet: MultiSelectDataRepresentationConfigModel|DeterminedByEngine=undefined
  public tablet:MultiSelectDataRepresentationConfigModel|DeterminedByEngine=undefined
  public laptop: MultiSelectDataRepresentationConfigModel|DeterminedByEngine=undefined
  public highResolution: MultiSelectDataRepresentationConfigModel|DeterminedByEngine=undefined
  setSmartphone(smartphone:MultiSelectDataRepresentationConfigModel){
    this.smartphone = smartphone
    return this
  }
  setPortraitTablet(portraitTablet: MultiSelectDataRepresentationConfigModel| DeterminedByEngine){
    this.portraitTablet = portraitTablet
    return this
  }
  setTablet(tablet: MultiSelectDataRepresentationConfigModel| DeterminedByEngine){
    this.tablet = tablet
    return this
  }
  setLaptop(laptop: MultiSelectDataRepresentationConfigModel | DeterminedByEngine){
    this.laptop = laptop
    return this
  }
  setHighResolution(highResolution: MultiSelectDataRepresentationConfigModel| DeterminedByEngine){
    this.highResolution = highResolution
    return this
  }
  constructor(public smartphone:MultiSelectDataRepresentationConfigModel) {
    super()
  }
  getInstance(){
    return 'content-injection'
  }
  public getDataRepresentationRenderProperties(screenSize: number): MultiSelectDataRepresentationRenderModel {
    const config = this.getConfigModel(screenSize)
    const renderInstance = new MultiSelectDataRepresentationRenderModel()
    Object.entries(config).forEach(([k,v])=>{
      if(v) renderInstance?.setProperty(k,v)
    })
    return renderInstance
  }

}
