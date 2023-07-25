import { Injectable } from '@angular/core';
import {ActionsService} from "./actions.service";
import {ActionType} from "./enums/actionTypes.enum";
import {ActionSubType} from "./enums/actionSubTypes.enum";
import {EventType} from "./enums/eventTypes.enum";
import {ActionModel} from "./models/ActionModel";
import {ConfigService} from "./config.service";
import {Subject} from "rxjs";
import {StoreService} from "./store.service";
import {ResponsiveBehaviourService} from "./responsive-behaviour.service";

@Injectable({
  providedIn: 'root'
})
export class UIActionsService {
  public actionFinished = new Subject()

  constructor(private configService:ConfigService,private actionsService:ActionsService,private RBS:ResponsiveBehaviourService) {
    this.actionsService.bindToActionsEmitter.subscribe(res=>{
      this.bindActions()
    })
  }
  public bindActions(){
    this.actionsService.bindToAction(ActionType.Client,ActionSubType.SetConfigValueAndRebuild)?.subscribe(res=>{
      if(res){
        const action = this.setConfigValueAndRebuild(res.action)
        if(action){
          this.actionFinished.next({event:EventType.ActionFinished,sourceId:res.action.id})
        }
      }
    })
    this.actionsService.bindToAction(ActionType.Client,ActionSubType.SetProperty)?.subscribe(res=>{
      if(res){
        const action = this.setConfigValueAndRebuild(res.action)
        if(action){
          this.actionFinished.next({event:EventType.ActionFinished,sourceId:res.action.id})
        }
      }
    })
  }
  private setConfigValueAndRebuild(action:ActionModel){
    const currentAppConfig = this.configService.appConfig
    if(currentAppConfig){
      let config = currentAppConfig.getComponentConfig(action.targetName)
      if(!config) config = currentAppConfig.getComponentConfigThroughAttributes(action.targetName)
      if(!config) throw new Error('action was not configured correctly')
      if(config.replace){
        config.replace(action.value?.getInstance(),action.value)
        this.configService.saveConfig(currentAppConfig)
        // todo verander methode naar specifieke prop update
        this.RBS.rebuildUI()
        return true
      }
    }
    return false
  }
}
