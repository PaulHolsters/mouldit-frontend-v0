import {Injectable} from '@angular/core';
import {ActionsService} from "./actions.service";
import {ConfigService} from "./config.service";
import {Subject} from "rxjs";
import {ResponsiveBehaviourService} from "./responsive-behaviour.service";
import {StateService} from "./state.service";
import {RenderPropertiesService} from "./renderProperties.service";
import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {ServerDataService} from "./data/server/server-data.service";
import {Action} from "../effectclasses/Action";
import {ActionType} from "../enums/actionTypes.enum";
import {TriggerType} from "../enums/triggerTypes.enum";
import {
  ActionIdType, ComponentAsSource,
  ComponentNameType, EffectAsSource, EffectIdType, isComponentAsSource, isComponentName,
  isDataLink,
  isFormTargetType, isMessage, isRepeatedComponentType,
  ServerDataRequestType
} from "../types/type-aliases";
import {ActionValueModel} from "../design-dimensions/ActionValueModel";
import {ClientDataService} from "./data/client/client-data.service";
import {Effect} from "../effectclasses/Effect";
import {Blueprint} from "./data/client/Blueprint";
import {ClientData} from "./data/client/ClientData";
import {
  ComponentModelType,
  DataRecord,
  isClientData,
  isDataRecord,
  List,
  OutputData,
  RenderPropertyType
} from "../types/union-types";
import {NoValueType} from "../enums/NoValueTypes.enum";
import {
  ResponsiveContainerChildLayoutConfigModel
} from '../design-dimensions/ComponentSpecificLayout/Container/ResponsiveContainerChildLayoutConfigModel';
import {ResponsiveOverflowConfigModel} from '../design-dimensions/Overflow/ResponsiveOverflowConfigModel';
import {ResponsiveSizeConfigModel} from '../design-dimensions/Size/ResponsiveSizeConfigModel';
import {ResponsiveVisibilityConfigModel} from '../design-dimensions/Visibility/ResponsiveVisibilityConfigModel';
import {Datalink} from "../design-dimensions/datalink";
import {Message, MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class UiActionsService {
  public actionFinished = new Subject<{ trigger: TriggerType.ActionFinished, source: [EffectIdType, number | undefined] | ActionIdType }>()

  constructor(
    private renderPropertiesService: RenderPropertiesService,
    private stateService: StateService,
    private configService: ConfigService,
    private actionsService: ActionsService,
    private RBS: ResponsiveBehaviourService,
    private dataService: ServerDataService,
    private clientDataService: ClientDataService) {
    this.actionsService.bindToActionsEmitter.subscribe(res => {
      this.bindActions()
    })
  }

  public bindActions() {
    this.actionsService.bindToAction(new Action('', ActionType.SetLocalConfigurationValueAndRebuild))?.subscribe(res => {
      if (res && res.effect.action instanceof Action) {
        const action = this.setConfigValueAndRebuild(res.effect.action)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.ShowToastMessage))?.subscribe(res => {
      if (res && res.effect.action instanceof Action && isMessage(res.data)) {
        const action = this.showToast(res.effect.action,res.data)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.SetConfirmation))?.subscribe(res => {
      if (res && res.target && res.target instanceof EventTarget && res.effect.action instanceof Action) {
        const action = this.setConfirmation(res.effect.action, res.data, res.target)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.SetRenderProperty))?.subscribe(res => {
      // todo fix bug: res lijkt niet aan de voorwaarde te voldoen => res.source is een array
      if (res && res.effect.action instanceof Action) {
        const action = this.setProperty(res.effect.action, res.data, res.source)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.UpdateDataRelatedProperties))?.subscribe(res => {
      if (res) {
        const action = this.updateDataRelatedProps(res)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.UpdateDataProperties))?.subscribe(res => {
      if (res) {
        const action = this.outputData(res)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.UpdateDataDependedProperties))?.subscribe(res => {
      if (res) {
        const action = this.updateDataDependedProps(res)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
    this.actionsService.bindToAction(new Action('', ActionType.SetUpIndexedComponent))?.subscribe(res => {
      if (res) {
        const action = this.setUpIndexedComponent(res)
        if (action) {
          this.actionFinished.next({trigger: TriggerType.ActionFinished, source: res.effect.action.id})
        }
      }
    })
  }

  private updateDataRelatedProps(res: {
    effect: Effect,
    data: { clientData: ClientData, effectAsSource: EffectAsSource | undefined } | undefined,
    target: EventTarget | undefined
  }) {
    if (res.data) {
      const dl = this.configService.getConfigFromRoot(res.data.clientData.name)
      if (dl) {
        const target = this.configService.effects.map(e => {
          return e.action.target
        }).find(t => {
          return (typeof t !== 'string' && !(isRepeatedComponentType(t, this.configService)) && (t?.controls.map(c => {
            return c.target
          }).includes(dl.name)))
        })
        if (isFormTargetType(target)) {
          const field = target.controls.find(f => {
            return f.target === dl.name
          })?.field
          if (field) {
            // todo rewrite als je een bepaald stuk eruit wilt halen
            /*            const value = res.data.blueprint.getBlueprintValueForDataLink(field)
                        const input: {
                          [key: string]: any
                        } | undefined
                          = dl.dataInput?.getDataInputRenderProperties(this.RBS.screenSize,
                          value)
                        const repres: {
                          [key: string]: any
                        } | undefined
                          = dl.dataRepresentation?.getDataRepresentationRenderProperties(this.RBS.screenSize,
                          value)
                        this.renderPropertiesService.getStatePropertySubjects().filter(sp => {
                          return sp.componentName === dl.name
                        }).forEach(prop => {
                          if (input && prop.propName in input) {
                            prop.propValue.next(input[prop.propName])
                          }
                          if (repres && prop.propName in repres) {
                            prop.propValue.next(repres[prop.propName])
                          }
                        })*/
          }
        } else {
          // a normal component as target
          // dit zal dan wellicht enkel gaan over data representation
        }
      }
    }
    return true
  }

  private updateDataDependedProps(res: {
    effect: Effect,
    data: Blueprint | [ComponentNameType, DataRecord | List] | [ComponentNameType | [ComponentNameType, number], [Array<[PropertyName, Datalink, Function[]]>, DataRecord]]
      | ClientData | string | ServerDataRequestType | DataRecord | List,
    target: EventTarget | undefined
  }) {
    if (
      res.data instanceof Array
      && res.data.length === 2
      && (isComponentName(res.data[0], this.configService) || (
        res.data[0] instanceof Array && res.data[0].length === 2
        && isComponentName(res.data[0][0], this.configService) && typeof res.data[0][1] === 'number'
      ))
      && res.data[1] instanceof Array && res.data[1][0] instanceof Array && res.data[1][0].length > 0) {
      let compName: ComponentNameType
      let index: number | undefined
      if (isComponentName(res.data[0], this.configService)) {
        compName = res.data[0]
      } else {
        compName = res.data[0][0]
        index = res.data[0][1]
      }
      // wat je moet beseffen is dat elke component zelf om de data transformatie vraagt, je hoeft dus geen children te gaan opzoeken

      const data = res.data[1][1]
      let existingDataByProps // dit is dan al onmiddellijk de nieuwe
        = this.stateService.getValue(compName, PropertyName.propsByData, index) as (Array<[PropertyName, Datalink, Function[]]> | undefined)
      if (!existingDataByProps) existingDataByProps = [];
      existingDataByProps.forEach(p => {
        // send new data to frontend component
        // per property in de nieuwe array en stuur ook de nieuwe array
        this.renderPropertiesService.getStatePropertySubjects().find(prop => {
          return prop.componentName === compName && prop.propName === p[0] && prop.index === index
        })?.propValue.next((this.getData(data, p[1], p[2])))
      })
    }
    return true
  }

  private setUpIndexedComponent(res: {
    effect: Effect,
    data: Blueprint | [ComponentNameType, DataRecord | List] | [ComponentNameType, [Array<[PropertyName, Datalink, Function[]]>, DataRecord]]
      | ClientData | string | ServerDataRequestType | DataRecord | List,
    target: EventTarget | undefined
  }) {
    if (res.data instanceof Array && isComponentName(res.data[0], this.configService) && typeof res.data[1] === 'number') {
      const compConfig = this.configService.getConfigFromRoot(res.data[0])
      if (compConfig) {
        this.renderPropertiesService.createProps(compConfig, res.data[1])
        this.RBS.setState(compConfig, this.RBS.screenSize, res.data[1])
      }
    }
    return true
  }

  private getData(data: DataRecord, link: Datalink, pipe?: Function[]) {
    let head: string
    let tail: OutputData = data
    const dl: string[] = [];
    if (link.dataChunk instanceof Array) {
      dl.push(...link.dataChunk)
    } else dl.push(link.dataChunk);
    while (dl.length > 0) {
      head = dl.shift() as string
      if (dl.length > 0 && !(isDataRecord(tail))) throw new Error('bad datalink config')
      if (isDataRecord(tail)) {
        const entry: [string, (DataRecord | List | RenderPropertyType | string[] | number[] | boolean[] | Date[])] | undefined
          = Object.entries(tail).find(ent => {
          return ent[0] === head
        }) as [string, (DataRecord | List | RenderPropertyType | string[] | number[] | boolean[] | Date[])] | undefined
        if (entry) {
          tail = entry[1]
        }
      }
    }
    if (!pipe) return tail
    return pipe.reduce((prev, curr) => {
      return curr(prev)
    }, tail)
  }

  private outputData(
    res: {
      effect: Effect,
      data: { clientData: ClientData, effectAsSource: EffectAsSource | undefined } | undefined,
      target: EventTarget | undefined
    }
  ) {
    if (res.data) {
      const cd = res.data.clientData
      this.renderPropertiesService.getStatePropertySubjects().filter(ps => {
        return ps.componentName === cd.name
      }).forEach(propSubj => {
        switch (propSubj.propName) {
          case PropertyName.outputData:
            propSubj.propValue.next(cd.outputData)
            break
          case PropertyName.conceptBlueprint:
            //propSubj.propValue.next(cd.blueprint)
            break
          case PropertyName.dataLink:
            const action = this.configService.getActions(cd.id)
            const concept = cd && action instanceof Action ? action.conceptName : undefined
            if (isDataLink(concept, this.configService)) {
              propSubj.propValue.next(concept)
            }
            break
        }
      })
    } else {
      this.clientDataService.clientData.forEach(cd => {
        // todo
      })
    }
    return true
  }

  private replace(key: string | undefined, config: ComponentModelType, value: ResponsiveSizeConfigModel
    | ResponsiveOverflowConfigModel | ResponsiveContainerChildLayoutConfigModel | ResponsiveVisibilityConfigModel | string | number | undefined) {
    if (key) {
      Reflect.set(config, key, value)
    }
  }

  private setConfigValueAndRebuild(action: Action) {
    // todo verwijder alle clientdata
    const currentAppConfig = this.configService.appConfig
    if (currentAppConfig && typeof action.target === 'string') {
      let config = this.configService.getConfigFromRoot(action.target)
      if (!config) throw new Error('action was not configured correctly')
      if ((action.value instanceof ActionValueModel)) {
        // ResponsiveSizeConfigModel | ResponsiveOverflowConfigModel | ResponsiveContainerChildLayoutConfigModel | ResponsiveVisibilityConfigModel
        if (action.value.value !== 'list' && action.value.value !== 'object' && typeof action.value.value !== 'function' && typeof action.value.value !== 'boolean')
          this.replace(action.value.name, config, action.value.value)
        this.configService.saveConfig(currentAppConfig)
        this.RBS.rebuildUI()
        return true
      }
    }
    return false
  }

  private setProperty(action: Action, data?: any, source?: string | [string, number | undefined] | [string, string] | undefined) {
    if (typeof action.target === 'string'
      && action.value instanceof ActionValueModel
      && action.value.name === PropertyName.visible
      && action.value.value === false) {
      const children = this.configService.getAllDecendants(action.target)
      children.forEach(ch => {
        this.clientDataService.destroy(ch.name)
      })
    }
    let val: string | number | boolean | Function | ResponsiveSizeConfigModel | ResponsiveOverflowConfigModel
      | ResponsiveContainerChildLayoutConfigModel | ResponsiveVisibilityConfigModel | undefined
    if (typeof ((action.value as ActionValueModel).value) === 'function') {
      val = ((action.value as ActionValueModel).value as Function)(this.stateService, data)
    }
    if (!val) val = (action.value as ActionValueModel).value
    // todo maak methode waarmee je een reeks aan property-values naar een component kan sturen

    this.renderPropertiesService.getStatePropertySubjects().find(prop => {
      if (prop.componentName === action.target && action.value instanceof ActionValueModel)
        return prop.propName === PropertyName.data
      return false
    })?.propValue.next(data)

    if (action.target === NoValueType.CALCULATED_BY_ENGINE && source) {
      let name: string
      if (source instanceof Array) {
        name = source[0]
      } else {
        name = source
      }
      this.renderPropertiesService.getStatePropertySubjects().filter(prop => {
        const desc = this.configService.getAllDecendants(name).map(d => {
          return d.name
        })
        if (desc.includes(prop.componentName) && action.value instanceof ActionValueModel) {
          return prop.propName === action.value.name
        }
        return false
      }).forEach(p => {
        p.propValue.next(val)
      })
    } else if (isRepeatedComponentType(action.target, this.configService)) {
      const targetName = action.target[0]
      const parentName = this.configService.getParentConfigFromRoot(targetName)?.name
      const arr = parentName ? this.stateService.getValue(parentName, PropertyName.outputData) : undefined
      if (arr instanceof Array) {
        for (let i = 0; i < arr.length; i++) {
          this.renderPropertiesService.getStatePropertySubjects().find(prop => {
            if (prop.componentName === targetName && action.value instanceof ActionValueModel) {
              return prop.propName === action.value.name && prop.index === i
            }
            return false
          })?.propValue.next(val)
        }
      }
    } else {
      this.renderPropertiesService.getStatePropertySubjects().find(prop => {
        if (prop.componentName === action.target && action.value instanceof ActionValueModel) {
          if (isComponentAsSource(source, this.configService)) {
            if (action.target === source[0]) {
              return prop.propName === action.value.name && prop.index === source[1]
            } else {
              return prop.propName === action.value.name
            }
          } else {
            return prop.propName === action.value.name
          }
        }
        return false
      })?.propValue.next(val)
      return true
    }
    return true
  }

  private setConfirmation(action: Action, data?: any, target?: EventTarget) {
    /*    if(action.target!==NoValueType.NO_VALUE_ALLOWED){
          let comp = this.configService.getConfigFromRoot(action.target)
          if(comp && comp.attributes && this.RBS.screenSize){
            const attrVal = this.configService.getAttributeValue(this.RBS.screenSize,PropertyName.confirmationModel,comp.attributes)
            const cm = new ConfirmationModel(attrVal.icon,attrVal.message, target,data)
            this.renderPropertiesService.getStatePropertySubjects().find(prop=>{
              if(prop.componentName === action.target)
                return prop.propName === PropertyName.confirmationModel
              return false
            })?.propValue.next(cm)
          } else throw new Error('Component with name '+action.target+ ' could not be found')
        }*/
    return true
  }

  private showToast(action:Action,toast:Message) {
    this.renderPropertiesService.getStatePropertySubjects().find(prop => {
      return prop.componentName === action.target && prop.propName === PropertyName.message
    })?.propValue.next(toast)
    return true
  }
}

