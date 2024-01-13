import {Injectable, OnInit} from '@angular/core';
import {RenderPropertiesService} from "./renderProperties.service";
import {ActionsService} from "./actions.service";
import {ScreenSize} from "../enums/screenSizes.enum";
import {ConfigService} from "./config.service";
import {Subject} from "rxjs";
import {Action} from "../effectclasses/Action";
import {ActionType} from "../enums/actionTypes.enum";
import {TriggerType} from "../enums/triggerTypes.enum";
import {ActionIdType, ComponentNameType, EffectIdType} from "../types/type-aliases";
import {ComponentModelType, isNoValueType, RenderModelType} from "../types/union-types";
import {ChildLayoutRenderModel} from "../design-dimensions/ComponentSpecificLayout/Container/ChildLayoutRenderModel";
import {Container} from "../components/container/Container";
import {SizeConfigModel} from "../design-dimensions/Size/SizeConfigModel";
import {SizeRenderModel} from "../design-dimensions/Size/SizeRenderModel";

@Injectable({
  providedIn: 'root'
})
export class ResponsiveBehaviourService implements OnInit{
  private screensize:ScreenSize=ScreenSize.smartphone
  public actionFinished = new Subject<{trigger:TriggerType.ActionFinished,source:[EffectIdType,number|undefined]|ActionIdType}>()
  public get screenSize(){
    return this.screensize
  }
  private mqSM1 = window.matchMedia("(max-width: 480px)") //smartphone
  private mqPT1 = window.matchMedia("(min-width: 481px)") //portrait-tablet
  private mqPT2 = window.matchMedia("(max-width: 799px)") //portrait-tablet
  private mqT1 = window.matchMedia("(min-width: 800px)") //tablet
  private mqT2 = window.matchMedia("(max-width: 1024px)") //tablet
  private mqL1 = window.matchMedia("(min-width: 1025px)") //desktop
  private mqL2 = window.matchMedia("(max-width: 1280px)") //desktop
  private mqHR1 = window.matchMedia("(min-width: 1281px)") //HR

  constructor(private updateService:RenderPropertiesService,
              private configService:ConfigService,
              private actionsService:ActionsService,
              private renderPropertiesService:RenderPropertiesService) {
    this.actionsService.bindToActionsEmitter.subscribe(res=>{
      this.bindActions()
    })
  }
  public bindActions(){
    this.actionsService.bindToAction(new Action('',ActionType.SetGlobalResponsiveBehaviour))?.subscribe(res=>{
      if(res){
        this.setResponsiveBehaviour()
        this.actionFinished.next({trigger:TriggerType.ActionFinished,source:res.effect.action.id})
      }
    })
  }
  private setRBSState(componentName: string,
                     newState: RenderModelType|
                       (ComponentModelType[]),
                     index?:number): void {
    if (newState instanceof ChildLayoutRenderModel) {
      if (newState.parentProps) {
        for (let [k, v] of Object.entries(newState.parentProps)) {
          this.renderPropertiesService.getStatePropertySubjects().find(subj => {
            return subj.componentName === componentName && subj.propName === k && subj.index===index
          })?.propValue.next(v)
        }
      }
      if (newState.childProps) {
        // todo newState.childProps.width bevat wel degelijk de juiste waarde van 100%
        //      de code bevat dus wellicht fouten of de waarde wordt niet naar de juiste componenten doorgestuurd
        for (let [k, v] of Object.entries(newState.childProps)) {
          let parent = this.configService.getConfigFromRoot(componentName)
          if (parent?.children) {
            (parent.children as ComponentModelType[]).forEach(childComp => {
              this.renderPropertiesService.getStatePropertySubjects().find(subj => {
                return subj.componentName === childComp.name && subj.propName === k && subj.index===index
              })?.propValue.next(v)
            })
          }
        }
      }
    } else if(newState instanceof Array){
      this.renderPropertiesService.getStatePropertySubjects().find(subj => {
        return subj.componentName === componentName && subj.propName === 'children' && subj.index===index
      })?.propValue.next(newState)
    } else{
      for (let [k, v] of Object.entries(newState)) {
        if(v===null){
          const config = this.configService.getParentConfigFromRoot(componentName)
          if(config instanceof Container && !isNoValueType(config.componentSpecificLayout.childConfig)){
            const rps = config.componentSpecificLayout.childConfig.size.getSizeRenderProperties(this.screenSize)
            if(Reflect.has(rps,k) && !Reflect.get(rps,k)){
              this.renderPropertiesService.getStatePropertySubjects().find(subj => {
                return subj.componentName === componentName && subj.propName === k && subj.index===index
              })?.propValue.next(v)
            }
            const rpv = config.componentSpecificLayout.childConfig.visibility.getVisibilityRenderProperties(this.screenSize)
            if(Reflect.has(rpv,k) && !Reflect.get(rpv,k)){
              this.renderPropertiesService.getStatePropertySubjects().find(subj => {
                return subj.componentName === componentName && subj.propName === k && subj.index===index
              })?.propValue.next(v)
            }
          }
        } else{
          this.renderPropertiesService.getStatePropertySubjects().find(subj => {
            return subj.componentName === componentName && subj.propName === k && subj.index===index
          })?.propValue.next(v)
      }
    }
  }}
  ngOnInit(): void {
  }
  private setResponsiveBehaviour() {
    this.mqSM1.addEventListener("change", (e => {
      if (this.mqSM1.matches) {
        this.screensize = ScreenSize.smartphone
        this.setComponentStates(ScreenSize.smartphone)
      }
    }))
    window.addEventListener("load", (e => {
      if (this.mqSM1.matches) {
        this.screensize = ScreenSize.smartphone
        this.setComponentStates( ScreenSize.smartphone)
      }
    }))
    this.mqPT1.addEventListener("change", (e => {
      if (this.mqPT1.matches && this.mqPT2.matches) {
        this.screensize = ScreenSize.portraitTablet
        this.setComponentStates(ScreenSize.portraitTablet)
      }
    }))
    this.mqPT2.addEventListener("change", (e => {
      if (this.mqPT1.matches && this.mqPT2.matches) {
        this.screensize = ScreenSize.portraitTablet
        this.setComponentStates(ScreenSize.portraitTablet)
      }
    }))
    window.addEventListener("load", (e => {
      if (this.mqPT1.matches && this.mqPT2.matches) {
        this.screensize = ScreenSize.portraitTablet
        this.setComponentStates( ScreenSize.portraitTablet)
      }
    }))
    this.mqT1.addEventListener("change", (e => {
      if (this.mqT1.matches && this.mqT2.matches) {
        this.screensize = ScreenSize.tablet
        this.setComponentStates( ScreenSize.tablet)
      }
    }))
    this.mqT2.addEventListener("change", (e => {
      if (this.mqT1.matches && this.mqT2.matches) {
        this.screensize = ScreenSize.tablet
        this.setComponentStates(ScreenSize.tablet)
      }
    }))
    window.addEventListener("load", (e => {
      if (this.mqT1.matches && this.mqT2.matches) {
        this.screensize = ScreenSize.tablet
        this.setComponentStates(ScreenSize.tablet)
      }
    }))
    this.mqL1.addEventListener("change", (e => {
      if (this.mqL1.matches && this.mqL2.matches) {
        this.screensize = ScreenSize.laptop
        this.setComponentStates(ScreenSize.laptop)
      }
    }))
    this.mqL2.addEventListener("change", (e => {
      if (this.mqL1.matches && this.mqL2.matches) {
        this.screensize = ScreenSize.laptop
        this.setComponentStates(ScreenSize.laptop)
      }
    }))
    window.addEventListener("load", (e => {
      if (this.mqL1.matches && this.mqL2.matches) {
        this.screensize = ScreenSize.laptop
        this.setComponentStates(ScreenSize.laptop)
      }
    }))
    this.mqHR1.addEventListener("change", (e => {
      if (this.mqHR1.matches) {
        this.screensize = ScreenSize.highResolution
        this.setComponentStates(ScreenSize.highResolution)
      }
    }))
    window.addEventListener("load", (e => {
      if (this.mqHR1.matches) {
        this.screensize = ScreenSize.highResolution
        this.setComponentStates( ScreenSize.highResolution)
      }
    }))
  }
  public rebuildUI(){
    if (this.mqSM1.matches) {
      this.screensize = ScreenSize.smartphone
      this.setComponentStates(ScreenSize.smartphone)
    } else
    if (this.mqPT1.matches && this.mqPT2.matches) {
      this.screensize = ScreenSize.portraitTablet
      this.setComponentStates(ScreenSize.portraitTablet)
    } else
    if (this.mqT1.matches && this.mqT2.matches) {
      this.screensize = ScreenSize.tablet
      this.setComponentStates( ScreenSize.tablet)
    } else
    if (this.mqL1.matches && this.mqL2.matches) {
      this.screensize = ScreenSize.laptop
      this.setComponentStates(ScreenSize.laptop)
    } else
    if (this.mqHR1.matches) {
      this.screensize = ScreenSize.highResolution
      this.setComponentStates(ScreenSize.highResolution)
    }
  }
  public setState(component: ComponentModelType, screenSize: ScreenSize,index?:number) {
    // todo data related props worden geupdate in andere service en moeten er hier dus uit
    // alle config is aanwezig!
    this.setRBSState(component.name, component.visibility.getVisibilityRenderProperties(screenSize),index)
    this.setRBSState(component.name, component.size.getSizeRenderProperties(screenSize),index)
    this.setRBSState(component.name, component.individualLayout.getIndividualLayoutRenderProperties(screenSize),index)
    if(component.styling){
      this.setRBSState(component.name, component.styling.getStylingRenderProperties(screenSize),index)
    }
    // todo this.setRBSState(component.name, component.overflow.getOverflowRenderProperties(screenSize))
    // todo  if (component.styling) this.setRBSState(component.name, component.styling.getStylingRenderProperties(screenSize))
    if(component.dataRepresentation) {
      this.setRBSState(component.name, component.dataRepresentation.getDataRepresentationRenderProperties(screenSize),index)
    }
    if(component.dataInput){
      this.setRBSState(component.name, component.dataInput.getDataInputRenderProperties(screenSize),index)
    }
    if(component.structural) {
      this.setRBSState(component.name, component.structural.getStructuralRenderProperties(screenSize),index)
    }
    if (component.componentSpecificLayout){
      this.setRBSState(component.name, component.componentSpecificLayout.getRenderProperties(screenSize),index)
    }
    if (component.children && component.children.length > 0) {
      this.setRBSState(component.name, component.children,index)
    }
    if (component.contentInjection){
      const contentInjection = component.contentInjection.getContentInjectionRenderProperties(screenSize)
      this.setRBSState(component.name, contentInjection,index)
    }
  }
  public setComponentStates( screenSize: ScreenSize) {
    this.configService.getAllComponents(this.screenSize).forEach(c=>{
      this.setState(c, screenSize)
    })
  }

}
