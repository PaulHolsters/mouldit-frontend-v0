import {ScreenSize} from "../../../enums/screenSizes.enum";
import {ResponsiveConfigModel} from "../../ResponsiveConfigModel";
import {ToastLayoutRenderModel} from "./ToastLayoutRenderModel";
import {ToastLayoutConfigModel} from "./ToastLayoutConfigModel";
import {ResponsiveConfigModelI} from "../../../Interfaces/ResponsiveConfigModelI";
import {NoValueType} from "../../../enums/NoValueTypes.enum";

export class ResponsiveToastLayoutConfigModel extends ResponsiveConfigModel<ToastLayoutConfigModel>
implements ResponsiveConfigModelI<ToastLayoutConfigModel>{
  public smartphone:ToastLayoutConfigModel = new ToastLayoutConfigModel()
  public portraitTablet: ToastLayoutConfigModel|NoValueType.CALCULATED_BY_ENGINE=NoValueType.CALCULATED_BY_ENGINE
  public tablet:ToastLayoutConfigModel|NoValueType.CALCULATED_BY_ENGINE=NoValueType.CALCULATED_BY_ENGINE
  public laptop: ToastLayoutConfigModel|NoValueType.CALCULATED_BY_ENGINE=NoValueType.CALCULATED_BY_ENGINE
  public highResolution: ToastLayoutConfigModel|NoValueType.CALCULATED_BY_ENGINE=NoValueType.CALCULATED_BY_ENGINE
  setSmartphone(smartphone:ToastLayoutConfigModel){
    this.smartphone = smartphone
    return this
  }
  setPortraitTablet(portraitTablet: ToastLayoutConfigModel| NoValueType.CALCULATED_BY_ENGINE){
    this.portraitTablet = portraitTablet
    return this
  }
  setTablet(tablet: ToastLayoutConfigModel| NoValueType.CALCULATED_BY_ENGINE){
    this.tablet = tablet
    return this
  }
  setLaptop(laptop: ToastLayoutConfigModel | NoValueType.CALCULATED_BY_ENGINE){
    this.laptop = laptop
    return this
  }
  setHighResolution(highResolution: ToastLayoutConfigModel| NoValueType.CALCULATED_BY_ENGINE){
    this.highResolution = highResolution
    return this
  }
  constructor() {
    super()
  }
  setTableLayout(screenSize:ScreenSize,model:ToastLayoutConfigModel){
    Reflect.set(this,ScreenSize[screenSize],model)
  }
  getInstance(){
    return 'childLayout'
  }
  getRenderProperties(screenSize: number): ToastLayoutRenderModel {
    const config = this.getConfigModel(screenSize)
    const renderInstance = new ToastLayoutRenderModel()
    Object.entries(config).forEach(([k,v])=>{
      if(v) renderInstance.setProperty(k,v)
    })
    return renderInstance
  }
}
