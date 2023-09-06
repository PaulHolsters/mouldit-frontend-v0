import {Injectable} from '@angular/core';
import {ComponentModel} from "../models/ComponentModel";
import AppConfig from "./appConfig";
import {ComponentObjectModel} from "../models/ComponentObjectModel";
import {TriggerType} from "../enums/triggerTypes.enum";
import {ScreenSize} from '../enums/screenSizes.enum';
import {PropertyName} from '../enums/PropertyNameTypes.enum';
import {ResponsiveAttributesConfigModel} from '../models/Attributes/ResponsiveAttributesConfigModel';
import {TableColumnModel} from "../models/TableColumnModel";
import { Effect } from '../effectclasses/Effect';
import {ServiceType} from "../enums/serviceTypes.enum";
import {SystemEffects} from "../effectclasses/systemEffects";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {
  }
  public saveConfig(config: AppConfig) {
    // todo laat dit verlopen via een event!
    this._appConfig.push(Object.create(config))
  }
  public convertToComponentModels(userConfig: {
    components: (ComponentModel | ComponentObjectModel)[],
    effects: Effect[]
  }): { components: ComponentModel[], effects: Effect[] } {
    let convertedObj: { components: ComponentModel[], effects: Effect[] } = {
      components: [],
      effects: [...userConfig.effects]
    }
    let componentsCopy = [...userConfig.components]
    if(componentsCopy.length!==1) throw new Error('Only one root component is allowed')

    convertedObj.components = [this.getTreeOfComponentModels(this.convertToComponentModel(componentsCopy[0]))]
    return convertedObj
  }
  private getTreeOfComponentModels(component: ComponentModel): ComponentModel {
    // todo voeg hier de screensize ook aan toe
    const componentsWithChildrenToConvert:ComponentModel[] = this.convertChildren(component)
    while(componentsWithChildrenToConvert.length>0){
      const child:ComponentModel = componentsWithChildrenToConvert.pop() as ComponentModel
      componentsWithChildrenToConvert.unshift(...this.convertChildren(child))
    }
    return component
  }
  private convertChildren(component:ComponentModel):ComponentModel[]{
    const arr = []
    if (component.children) {
      for (let child of component.children) {
        child = this.convertToComponentModel(child)
        arr.push(child)
      }
    } else if (component.contentInjection) {
      for (let responsiveModel of Object.values(component.contentInjection)) {
        if(responsiveModel){
          for (let v of Object.values(responsiveModel)){
            if(v instanceof ComponentModel||this.isComponentObjectModel(v)){
              v = this.convertToComponentModel(v)
              arr.push(v)
            } else if(v instanceof Array){
              if(v.length>0){
                for (let vChild of v){
                  if(typeof vChild === 'object' && vChild.hasOwnProperty('field')  && vChild.hasOwnProperty('header')){
                    vChild = this.convertToComponentModel(vChild.anchor)
                    arr.push(vChild)
                  } else{
                    vChild = this.convertToComponentModel(vChild)
                    arr.push(vChild)
                  }
                }
              }
            }
          }
        }
      }
    }
    return arr
  }
  public getComponentObjectModelPropertyValue(comp: any, prop: string): any {
    // todo deze methode moet eruit!
    if (!this.isComponentObjectModel(comp)) return undefined
    switch (prop) {
      case 'name':
        return comp.name
      case 'dimensions':
        return comp.dimensions
      case 'visibility':
        return comp.visibility
      case 'children':
        return comp.children
      case 'childLayout':
        return comp.childLayout
      case 'styling':
        return comp.styling
      case 'overflow':
        return comp.overflow
      case 'attributes':
        return comp.attributes
      case 'position':
        return comp.position
      case 'type':
        return comp.type
      case 'data':
        return comp.data
      case 'contentInjection':
        return comp.contentInjection
      default:
        throw new Error('unknown property ' + prop)
    }
  }
  public isComponentObjectModel(l: unknown): boolean {
    if (l && typeof l === 'object' && !(l instanceof ComponentModel)) {
      const arrFoundKeys = Object.keys(l).filter(k => {
        return [
          'name',
          'dimensions',
          'position',
          'children',
          'childLayout',
          'visibility',
          'styling',
          'overflow',
          'attributes',
          'type',
          'data',
          'contentInjection'].includes(k)
      })
      return arrFoundKeys.length === Object.keys(l).length
    }
    return false
  }
  public convertToComponentModel(comp: ComponentObjectModel | ComponentModel | undefined | unknown): ComponentModel {
    if (this.isComponentObjectModel(comp)) {
      return new ComponentModel(
        this.getComponentObjectModelPropertyValue(comp, 'name'),
        this.getComponentObjectModelPropertyValue(comp, 'type'),
        this.getComponentObjectModelPropertyValue(comp, 'childLayout'),
        this.getComponentObjectModelPropertyValue(comp, 'position'),
        this.getComponentObjectModelPropertyValue(comp, 'dimensions'),
        this.getComponentObjectModelPropertyValue(comp, 'attributes'),
        this.getComponentObjectModelPropertyValue(comp, 'visibility'),
        this.getComponentObjectModelPropertyValue(comp, 'overflow'),
        this.getComponentObjectModelPropertyValue(comp, 'children'),
        this.getComponentObjectModelPropertyValue(comp, 'styling'),
        this.getComponentObjectModelPropertyValue(comp, 'data'),
        this.getComponentObjectModelPropertyValue(comp, 'contentInjection'))
    } else if (comp instanceof ComponentModel) {
      return comp
    }
    throw new Error('convertToComponentModel method cannot be used  for any other type but ComponentObjectModel | ComponentModel')
  }
  public get appConfig(): AppConfig {
    if (this._appConfig.length > 0)
      return Object.create(this._appConfig[this._appConfig.length - 1])
    throw new Error('appConfig requested when not yet initialised')
  }
  private _appConfig: AppConfig[] = []
  public getEffectsForComponent(name: string): Effect[]{
    return this.appConfig.userConfig.effects.filter((effect:Effect) => {
      return effect.action.target === name
    }).concat(...SystemEffects.getSystemEffects().filter((effect:Effect) => {
      return effect.action.target === name
    }))
  }
  public get effects(){
    return this.appConfig.userConfig.effects.concat(...SystemEffects.getSystemEffects())
  }
  public getEffectsForTrigger(trigger: TriggerType) {
    return this.appConfig.userConfig.effects.filter((effect: Effect) => {
      return effect.trigger.name === trigger
    }).concat(...SystemEffects.getSystemEffects().filter((effect:Effect) => {
      return effect.trigger.name === trigger
    }))
  }
  public getEffectsForEvent(trigger: TriggerType,source:string|ServiceType):Effect[] {
    return this.appConfig.userConfig.effects.filter((effect) => {
      return effect.trigger.name === trigger && effect.trigger.source===source
    }).concat(...SystemEffects.getSystemEffects().filter((effect:Effect) => {
      return effect.trigger.name === trigger && effect.trigger.source===source
    }))
  }
  public getConfig(nameComponent: string, component: ComponentModel): ComponentModel | undefined {
    if (component.name === nameComponent) return component
    const arr: ComponentModel[] = this.convertChildren(component)
    while (arr.length > 0) {
      const child: ComponentModel = arr.pop() as ComponentModel
      if (child.name === nameComponent) return child
      arr.unshift(...this.convertChildren(child))
    }
    return undefined
  }
  public getConfigFromRoot(nameComponent: string): ComponentModel | undefined {
    const componentsConfig = this.convertToComponentModels(this.appConfig.userConfig).components
    if (componentsConfig.length !== 1) throw new Error('Only one root component named content-container is allowed')
    return this.getConfig(nameComponent, componentsConfig[0])
  }
  public getParentConfig(nameComponent: string, component: ComponentModel): ComponentModel | undefined {
    if (component.name === nameComponent) return undefined
    const convertParentWithChildren = (parent: ComponentModel): [ComponentModel,ComponentModel][] => {
      const children = this.convertChildren(parent)
      const arr: [ComponentModel,ComponentModel][] = []
      for (let child of children) {
        arr.push([parent, child])
      }
      return arr
    }
    const arr: ComponentModel[][] = convertParentWithChildren(component)
    while (arr.length > 0) {
      const parentChild: ComponentModel[] = arr.pop() as ComponentModel[]
      if (parentChild[1].name === nameComponent) return parentChild[0]
      arr.unshift(...convertParentWithChildren(parentChild[1]))
    }
    return undefined
  }
  public getParentConfigFromRoot(nameComponent: string): ComponentModel | undefined {
    const componentsConfig = this.convertToComponentModels(this.appConfig.userConfig).components
    if (componentsConfig.length !== 1) throw new Error('Only one root component named content-container is allowed')
    if (componentsConfig[0].name === nameComponent) return undefined
    return this.getParentConfig(nameComponent, componentsConfig[0])
  }
  public isAncestor(nameComponent: string, nameAncestor: string): boolean {
    let parent = this.getParentConfigFromRoot(nameComponent)
    while (parent && parent.name !== nameAncestor) {
      parent = this.getParentConfigFromRoot(parent.name)
    }
    return parent !== undefined
  }
  public getFirstAncestorConfigWithProperty(nameComponent: string, component: ComponentModel, property: PropertyName): ComponentModel | undefined {
    let parent = this.getParentConfig(nameComponent, component)
    while (parent && !(parent.hasOwnProperty(property))) {
      parent = this.getParentConfig(nameComponent, parent)
    }
    return parent
  }
  public getFirstAncestorConfigWithPropertyFromRoot(nameComponent: string, property: PropertyName): ComponentModel | undefined {
    const componentsConfig = this.convertToComponentModels(this.appConfig.userConfig).components
    if (componentsConfig.length !== 1) throw new Error('Only one root component named content-container is allowed')
    return this.getFirstAncestorConfigWithProperty(nameComponent, componentsConfig[0], property)
  }
  isSubComponent(nameSubcomponent: string, nameParentComponent: string): boolean {
    const subComponent = this.getConfigFromRoot(nameSubcomponent)
    if (!subComponent) throw new Error('subcomponent does not exist')
    let parentOfSub = this.getParentConfigFromRoot(subComponent.name)
    while (parentOfSub && parentOfSub.name !== nameParentComponent) {
      parentOfSub = this.getParentConfigFromRoot(parentOfSub.name)
    }
    return parentOfSub !== undefined
  }


  getAttributeValue(screenSize: ScreenSize, confirmationModel: PropertyName, attributes: ResponsiveAttributesConfigModel): any {
    let lastScreenSize = screenSize
    const stateModelObj = Object.create(attributes)
    while (lastScreenSize >= 0) {
      if (stateModelObj[ScreenSize[lastScreenSize]]) {
        const prop = Object.keys(stateModelObj[ScreenSize[lastScreenSize]]).find(key => {
          return key === confirmationModel
        })
        if (prop) return stateModelObj[ScreenSize[lastScreenSize]][prop]
      }
      lastScreenSize--
    }
    throw new Error('No screensize configuration was found for given ResponsiveAttributesConfigModel and' +
      ' property ' + confirmationModel + ' and screen ' + ScreenSize[screenSize])
  }
/*  getAppTemplateData(): { components: ComponentModel[], ef: ActionModel[] } | undefined {
    return this.convertToComponentModels(this.appConfig?.userConfig)
  }*/
  getAllComponents(rootWithChildren?:boolean):ComponentModel[] {
    const allComponents:ComponentModel[] = []
    const components = [...this.appConfig.userConfig.components]
    if(components.length===1){
      const root = {...this.convertToComponentModel(components[0])}
      if(!rootWithChildren){
        const rootNoChildren = {...this.convertToComponentModel(components[0])}
        delete rootNoChildren.children
        allComponents.push(rootNoChildren)
      } else{
        allComponents.push(root)
      }
      const children:ComponentModel[]=this.convertChildren(root)
      while(children.length>0){
        const child:ComponentModel = children.pop() as ComponentModel
        allComponents.push(child)
        children.unshift(...this.convertChildren(child))
      }
      return allComponents
    } else throw new Error('Er mag maar 1 root component zijn')
  }
}

/*  private resolve(value: CalculationModel): MixedArrayModel {
    let paramsArr: MixedArrayModel = []
    for (let v of value.values) {
      if (typeof v === 'object' && v.hasOwnProperty('calc')) {
        paramsArr = paramsArr.concat(this.resolve(v))
      } else if (typeof v === 'object') {
        Object.values(v).forEach(val => {
          paramsArr.push(val)
        })
      } else {
        paramsArr.push(v)
      }
    }
    paramsArr.push(this.storeService.getStatePropertySubjects())
    for (let [attr, val] of Object.entries(myFunctions)) {
      if (attr === value.calc) {
        const calcRes = Reflect.apply(val.fun, null, paramsArr)
        if (typeof calcRes === 'object') {
          const result = []
          for (let val of Object.values(calcRes)) {
            result.push(val)
          }
          return result
        }
        return [calcRes]
      }
    }
    throw ('no calculation found to be executed for ' + value.calc)
  }*/
/*  private emitNewPropValueFor(componentName: string, propName: string, value: string | boolean | number | CalculationModel) {
    let valueToSet
    if (typeof value === 'object') {
      valueToSet = this.resolve(value)[0]
    } else {
      valueToSet = value
    }
    this.storeService.getStatePropertySubjects().find(subj => {
      return subj.componentName === componentName && subj.propName === propName
    })?.propValue.next(valueToSet)
  }*/
/*  executeAction(action: ActionModel) {
    if (action.action === 'set') {
      action.props.forEach(prop => {
        if (this.conditionsMet(prop)) {
          this.emitNewPropValueFor(action.target, prop.name, prop.value)
        }
      })
    } else {
      action.props.forEach(prop => {
        for (let [attr, val] of Object.entries(myFunctions)) {
          if (attr === action.action) {
            if (this.conditionsMet(prop)) {
              const paramsArr = [
                action.target,
                prop.name,
                this.storeService.getStatePropertySubjects()
              ]
              this.emitNewPropValueFor(action.target, prop.name, Reflect.apply(val.fun, null, paramsArr))
            }
            break
          }
        }
      })
    }
  }*/
/*  private conditionsMet(prop: CalculationConfigModel): boolean {
    for (let [attr, val] of Object.entries(comparisons)) {
      if (attr === prop.condition?.comparison) {
        let valuesArr: any[] = []
        prop.condition.values.forEach(v => {
          if (typeof v === 'object' && v.hasOwnProperty('calc')) {
            valuesArr = valuesArr.concat(this.resolve(v))
          } else if (typeof v === 'object') {
            // dan zijn er geen dieperliggende calculation verboregen in dit object!
            Object.values(v).forEach(val => {
              valuesArr.push(val)
            })
          } else {
            valuesArr.push(v)
          }
        })
        valuesArr.push(this.storeService.getStatePropertySubjects())
        return Reflect.apply(val.fun, null, valuesArr)
      }
    }
    return true
  }*/
/*  public getConfig(nameComponent: string, component?: ComponentModel): ComponentModel | undefined {
    // todo werk recursief gebeuren eruit?
    if (component) {
      if (component.name !== compName) {
        if (component.children) {
          for (let j = 0; j < component.children.length; j++) {
            // hier ga je bv de menubar component hebben
            const childComp = component.children[j]
            if (typeof childComp !== 'string') {
              const comp = this.getComponentConfig(compName, this.convertToComponentModel(childComp))
              if (comp) {
                return comp
              }
            } else {
              // todo later string [] variant toevoegen
              throw new Error('string components not implemented')
            }
          }
        }
      } else return component
    } else {
      for (let i = 0; i < this.appConfig?.userConfig.components.length; i++) {
        if (this.appConfig.userConfig.components[i].name !== compName) {
          const children = this.appConfig.userConfig.components[i].children
          if (children) {
            for (let k = 0; k < children.length; k++) {
              const elTemp = children[k]
              if (typeof elTemp !== 'string') {
                const comp = this.getComponentConfig(compName, this.convertToComponentModel(elTemp))
                if (comp) {
                  return comp
                }
              } else {
                // todo later string [] variant toevoegen
                throw new Error('string components not implemented')
              }
            }
          }
        } else {
          return this.convertToComponentModel(this.appConfig.userConfig.components[i])
        }
      }
    }
    return undefined
  }*/
/*  public getParentComponentConfigWithProperty(compName: string,
                                              property: string,
                                              component?: ComponentModel,
                                              previousComponent?: ComponentModel)
    : ComponentModel | undefined {
    // todo ga na of de referenties mekaar niet beginnen wijzigen en er dus deep copies nodig zijn
    if (compName === 'sort-h1') debugger
    if (component) {
      if (component.name !== compName) {
        if (component.children) {
          for (let j = 0; j < component.children.length; j++) {
            let previousComponent
            let componentNow: ComponentModel | undefined | string = (component.children[j])
            if (typeof componentNow !== 'string') {
              componentNow = this.convertToComponentModel(componentNow)
              if (componentNow && componentNow.hasOwnProperty(property)
                && componentNow.getPropertyValue
                && componentNow.getPropertyValue(property) !== undefined
              ) {
                previousComponent = componentNow
              }
              const comp = this.getParentComponentConfigWithProperty(compName, property, componentNow, previousComponent)
              if (comp) {
                return comp
              }
            } else {
              // todo als comp string is
              throw new Error('string components not implemented')
            }
          }
        }
      } else return previousComponent
    } else {
      for (let i = 0; i < this.appConfig.userConfig.components.length; i++) {
        if (this.appConfig.userConfig.components[i].name !== compName) {
          const childComponents = this.appConfig.userConfig.components[i].children
          if (childComponents) {
            for (let k = 0; k < childComponents.length; k++) {
              let previousComponent
              let childComp = childComponents[k]
              if (typeof childComp !== 'string') {
                const componentNow = this.convertToComponentModel(childComp)
                if (componentNow && componentNow.hasOwnProperty(property)
                  && componentNow.getPropertyValue
                  && componentNow.getPropertyValue(property) !== undefined
                ) {
                  previousComponent = componentNow
                }
                const comp = this.getParentComponentConfigWithProperty(compName, property, componentNow, previousComponent)
                if (comp) {
                  return comp
                }
              } else {
                // todo als comp string is
                throw new Error('string components not implemented')
              }
            }
          }
        } else return previousComponent
      }
    }
    return undefined
  }

  public getParentComponentConfig(baseComponent: ComponentModel): ComponentModel | undefined {

  }

  public getComponentConfigThroughAttributes(compName: string, childComp?: ComponentModel): ComponentModel | undefined {
    // todo aanpassen zodat actionBtn's gevonden worden in een niet componentmodel achtige property =>
    //      nedeel is dat je dan overal moet gaan doorploegen = NOK!
    if (childComp) {
      if (childComp.name === compName) return childComp
      if (childComp.attributes !== undefined) {
        for (let [k, v] of Object.entries(childComp.attributes)) {
          if (v) {
            for (let [j, l] of Object.entries(v)) {
              if ((l instanceof ComponentModel && l.name === compName)
                || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)) {
                return this.convertToComponentModel(l)
              }
              if ((l instanceof ComponentModel && (l.attributes !== undefined || l.children !== undefined))
                || (this.isComponentObjectModel(l) && (this.getComponentObjectModelPropertyValue(l, 'attributes') ||
                  this.getComponentObjectModelPropertyValue(l, 'children')))) {
                const component = this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(l))
                if (component) {
                  return component
                }
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && l[i].name === compName)
                    || (this.isComponentObjectModel(l[i]) && this.getComponentObjectModelPropertyValue(l[i], 'name') === compName)) {
                    return this.convertToComponentModel(l[i])
                  }
                  if ((l[i] instanceof ComponentModel && (l[i].attributes !== undefined || l[i].children !== undefined))
                    || (this.isComponentObjectModel(l[i]) && (this.getComponentObjectModelPropertyValue(l[i], 'attributes') ||
                      this.getComponentObjectModelPropertyValue(l[i], 'children')))) {
                    const component = this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(l[i]))
                    if (component) {
                      return component
                    }
                  }
                  // je moet returnen op het moment dat je de component met de naam in kwestie hebt gevonden
                  // in het geval van actionBtn kunnen dat er meer zijn
                  if (l[i] instanceof TableColumnModel) {
                    if (l[i].anchor.name === compName) return l[i].anchor
                    if (l[i].anchor.children !== undefined) {
                      for (let j = 0; j < l[i].anchor.children.length; j++) {
                        const actualC = l[i].anchor.children[j]
                        if (typeof actualC !== 'string') {
                          const component = this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(actualC))
                          if (component) {
                            return component
                          }
                        } else {
                          // todo als comp string is
                          throw new Error('string components not implemented')
                        }
                      }
                    }
                    // todo in principe moeten we nu testen op attributes maar dan is er geen stoppen meer aan en moeten de methodes
                    //      gerefactored worden, maw in een tablecolumn magen geen componenten zitten met componenten in de attributen !!!
                  }
                }
              }
            }
          }
        }
      }
      if (childComp.children !== undefined) {
        for (let j = 0; j < childComp.children.length; j++) {
          const actualC = childComp.children[j]
          if (typeof actualC !== 'string') {
            const component = this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(actualC))
            if (component) {
              return component
            }
          } else {
            // todo als comp string is
            throw new Error('string components not implemented')
          }
        }
      }
    } else if (this.appConfig.userConfig.components !== undefined) {
      for (let i = 0; i < this.appConfig.userConfig.components.length; i++) {
        const childComp = this.appConfig.userConfig.components[i]
        if (childComp.attributes !== undefined) {
          for (let [k, v] of Object.entries(childComp.attributes)) {
            if (v) {
              for (let [j, l] of Object.entries(v)) {
                if ((l instanceof ComponentModel && l.name === compName)
                  || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)) {
                  return this.convertToComponentModel(l)
                }
                if (l instanceof Array) {
                  for (let i = 0; i < l.length; i++) {
                    if ((l[i] instanceof ComponentModel && l[i].name === compName)
                      || (this.isComponentObjectModel(l[i]) && this.getComponentObjectModelPropertyValue(l[i], 'name') === compName)) {
                      return this.convertToComponentModel(l[i])
                    } else if (l[i] instanceof TableColumnModel) {
                      if (l[i].anchor.name === compName) return l[i].anchor
                      if (l[i].anchor.children !== undefined) {
                        for (let j = 0; j < l[i].anchor.children.length; j++) {
                          const actualC = l[i].anchor.children[j]
                          if (typeof actualC !== 'string') {
                            const component = this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(actualC))
                            if (component) {
                              return component
                            }
                          } else {
                            // todo als comp string is
                            throw new Error('string components not implemented')
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (childComp.children !== undefined) {
          for (let j = 0; j < childComp.children.length; j++) {
            const actualC = childComp.children[j]
            if (typeof actualC !== 'string') {
              const component =
                this.getComponentConfigThroughAttributes(compName, this.convertToComponentModel(actualC))
              if (component) {
                return component
              }
            } else {
              // todo als comp string is
              throw new Error('string components not implemented')
            }
          }
        }
      }
    }
    return undefined
  }

  public getParentComponentConfigWithPropertyThroughAttributes(compName: string,
                                                               property: string,
                                                               childComp?: ComponentModel,
                                                               previous?: ComponentModel): ComponentModel | undefined {
    if (childComp) {
      if (childComp.name === compName) return previous
      if (childComp.attributes !== undefined) {
        for (let [k, v] of Object.entries(childComp.attributes)) {
          if (v) {
            for (let [j, l] of Object.entries(v)) {
              if (
                (l instanceof ComponentModel && l.name === compName)
                || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)
              ) {
                return previous
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && l[i].name === compName)
                    || (this.isComponentObjectModel(l[i]) && this.getComponentObjectModelPropertyValue(l[i], 'name') === compName)) {
                    return previous
                  } else if (l[i] instanceof TableColumnModel) {
                    if (l[i].anchor.name === compName) return previous
                  }
                }
              }
              let previousComponent
              if ((l instanceof ComponentModel && l.hasOwnProperty(property)
                  && l.getPropertyValue
                  && l.getPropertyValue(property) !== undefined)
                || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, property) !== undefined)) {
                previousComponent = l
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && l[i].hasOwnProperty(property)
                      && l[i].getPropertyValue
                      && l[i].getPropertyValue(property) !== undefined)
                    || (this.isComponentObjectModel(l[i]) && this.getComponentObjectModelPropertyValue(l[i], property) !== undefined)) {
                    previousComponent = l[i]
                    // todo hier lijkt een break te missen
                  } else if (l[i] instanceof TableColumnModel && l[i].anchor.hasOwnProperty(property) && l[i].anchor.getPropertyValue
                    && l[i].anchor.getPropertyValue(property) !== undefined) {
                    previousComponent = l[i].anchor
                  }
                }
              }
              if ((l instanceof ComponentModel && (l.attributes !== undefined || l.children !== undefined))
                || (this.isComponentObjectModel(l) && (this.getComponentObjectModelPropertyValue(l, 'attributes') ||
                  this.getComponentObjectModelPropertyValue(l, 'children')))) {
                let component
                if (previousComponent) component =
                  this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                    this.convertToComponentModel(l),
                    this.convertToComponentModel(previousComponent))
                else component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                  this.convertToComponentModel(l), previous)
                if (component) {
                  return component
                }
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && (l[i].attributes !== undefined || l[i].children !== undefined))
                    || (this.isComponentObjectModel(l[i]) && (this.getComponentObjectModelPropertyValue(l[i], 'attributes') ||
                      this.getComponentObjectModelPropertyValue(l[i], 'children')))) {
                    let component
                    if (previousComponent) {
                      component =
                        this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                          this.convertToComponentModel(l[i]),
                          this.convertToComponentModel(previousComponent))
                    } else {
                      component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                        this.convertToComponentModel(l[i]), previous)
                    }
                    if (component) {
                      return component
                    }
                  } else if (l[i] instanceof TableColumnModel && (l[i].anchor.attributes !== undefined || l[i].anchor.children !== undefined)) {
                    let component
                    if (previousComponent) {
                      component =
                        this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                          l[i].anchor,
                          previousComponent)
                    } else {
                      component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                        l[i].anchor,
                        previousComponent)
                    }
                    if (component) {
                      return component
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (childComp.children !== undefined) {
        for (let j = 0; j < childComp.children.length; j++) {
          let previousComponent
          const actualComp = childComp.children[j]
          if (typeof actualComp !== 'string') {
            const componentNow = this.convertToComponentModel(actualComp)
            if ((componentNow instanceof ComponentModel && componentNow.hasOwnProperty(property)
                && componentNow.getPropertyValue
                && componentNow.getPropertyValue(property) !== undefined)
              || (this.isComponentObjectModel(componentNow) && this.getComponentObjectModelPropertyValue(componentNow, property) !== undefined)) {
              previousComponent = componentNow
            }
            let component
            if (previousComponent) component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
              componentNow, previousComponent)
            else component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
              componentNow, previous)
            if (component) {
              return component
            }
          } else {
            // todo als comp string is
            throw new Error('string components not implemented')
          }

        }
      }
    } else {
      for (let i = 0; i < this.appConfig.userConfig.components.length; i++) {
        const comp = this.appConfig.userConfig.components[i]
        if (comp.attributes !== undefined) {
          for (let [k, v] of Object.entries(comp.attributes)) {
            if (v) {
              for (let [j, l] of Object.entries(v)) {
                // todo array wordt niet gecontroleerd
                if ((l instanceof ComponentModel && l.name === compName)
                  || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)) {
                  return previous
                }
                let previousComponent
                if ((l instanceof ComponentModel && l.hasOwnProperty(property)
                    && l.getPropertyValue
                    && l.getPropertyValue(property) !== undefined)
                  || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, property) !== undefined)) {
                  previousComponent = l
                }
                if (l instanceof ComponentModel || this.isComponentObjectModel(l)) {
                  let component
                  if (previousComponent) component =
                    this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                      this.convertToComponentModel(l), this.convertToComponentModel(previousComponent))
                  else component = this.getParentComponentConfigWithPropertyThroughAttributes(compName, property,
                    this.convertToComponentModel(l), previous)
                  if (component) return component
                }
              }
            }
          }
        }
        if (comp.children !== undefined) {
          for (let j = 0; j < comp.children.length; j++) {
            let previousComponent
            const actualC = comp.children[j]
            if (typeof actualC !== 'string') {
              const componentNow = this.convertToComponentModel(actualC)
              if ((componentNow instanceof ComponentModel && componentNow.hasOwnProperty(property)
                  && componentNow.getPropertyValue
                  && componentNow.getPropertyValue(property) !== undefined)
                || (this.isComponentObjectModel(componentNow) && this.getComponentObjectModelPropertyValue(componentNow, property) !== undefined)) {
                previousComponent = actualC
              }
              let component
              if (previousComponent) component =
                this.getParentComponentConfigWithPropertyThroughAttributes(compName,
                  property, componentNow, previousComponent)
              else component =
                this.getParentComponentConfigWithPropertyThroughAttributes(compName,
                  property, componentNow, previous)
              if (component) {
                return component
              }
            } else {
              // todo als comp string is
              throw new Error('string components not implemented')
            }
          }
        }
      }
    }
    return undefined
  }

  public getParentComponentConfigThroughAttributes(compName: string,
                                                   childComp?: ComponentModel,
                                                   previous?: ComponentModel): ComponentModel | undefined {
    if (childComp) {
      if (childComp.name === compName) return previous
      if (childComp.attributes !== undefined) {
        for (let [k, v] of Object.entries(childComp.attributes)) {
          if (v) {
            for (let [j, l] of Object.entries(v)) {
              if (
                (l instanceof ComponentModel && l.name === compName)
                || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)
              ) {
                return previous
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && l[i].name === compName)
                    || (this.isComponentObjectModel(l[i]) && this.getComponentObjectModelPropertyValue(l[i], 'name') === compName)) {
                    return previous
                  } else if (l[i] instanceof TableColumnModel) {
                    if (l[i].anchor.name === compName) return previous
                  }
                }
              }
              let previousComponent
              if ((l instanceof ComponentModel)
                || (this.isComponentObjectModel(l))) {
                previousComponent = l
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if (l[i] instanceof ComponentModel
                    || this.isComponentObjectModel(l[i])) {
                    previousComponent = l[i]
                    // todo hier lijkt een break te missen
                  } else if (l[i] instanceof TableColumnModel) {
                    previousComponent = l[i].anchor
                  }
                }
              }
              if ((l instanceof ComponentModel && (l.attributes !== undefined || l.children !== undefined))
                || (this.isComponentObjectModel(l) && (this.getComponentObjectModelPropertyValue(l, 'attributes') ||
                  this.getComponentObjectModelPropertyValue(l, 'children')))) {
                let component
                if (previousComponent) component =
                  this.getParentComponentConfigThroughAttributes(compName,
                    this.convertToComponentModel(l),
                    this.convertToComponentModel(previousComponent))
                else component = this.getParentComponentConfigThroughAttributes(compName,
                  this.convertToComponentModel(l), previous)
                if (component) {
                  return component
                }
              }
              if (l instanceof Array) {
                for (let i = 0; i < l.length; i++) {
                  if ((l[i] instanceof ComponentModel && (l[i].attributes !== undefined || l[i].children !== undefined))
                    || (this.isComponentObjectModel(l[i]) && (this.getComponentObjectModelPropertyValue(l[i], 'attributes') ||
                      this.getComponentObjectModelPropertyValue(l[i], 'children')))) {
                    let component
                    if (previousComponent) {
                      component =
                        this.getParentComponentConfigThroughAttributes(compName,
                          this.convertToComponentModel(l[i]),
                          this.convertToComponentModel(previousComponent))
                    } else {
                      component = this.getParentComponentConfigThroughAttributes(compName,
                        this.convertToComponentModel(l[i]), previous)
                    }
                    if (component) {
                      return component
                    }
                  } else if (l[i] instanceof TableColumnModel && (l[i].anchor.attributes !== undefined || l[i].anchor.children !== undefined)) {
                    let component
                    if (previousComponent) {
                      component =
                        this.getParentComponentConfigThroughAttributes(compName,
                          l[i].anchor,
                          previousComponent)
                    } else {
                      component = this.getParentComponentConfigThroughAttributes(compName,
                        l[i].anchor,
                        previousComponent)
                    }
                    if (component) {
                      return component
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (childComp.children !== undefined) {
        for (let j = 0; j < childComp.children.length; j++) {
          let previousComponent
          const actualComp = childComp.children[j]
          if (typeof actualComp !== 'string') {
            const componentNow = this.convertToComponentModel(actualComp)
            if (componentNow instanceof ComponentModel
              || this.isComponentObjectModel(componentNow)) {
              previousComponent = componentNow
            }
            let component
            if (previousComponent) component = this.getParentComponentConfigThroughAttributes(compName,
              componentNow, previousComponent)
            else component = this.getParentComponentConfigThroughAttributes(compName,
              componentNow, previous)
            if (component) {
              return component
            }
          } else {
            // todo als comp string is
            throw new Error('string components not implemented')
          }

        }
      }
    } else {
      for (let i = 0; i < this.appConfig.userConfig.components.length; i++) {
        const comp = this.appConfig.userConfig.components[i]
        if (comp.attributes !== undefined) {
          for (let [k, v] of Object.entries(comp.attributes)) {
            if (v) {
              for (let [j, l] of Object.entries(v)) {
                // todo array wordt niet gecontroleerd
                if ((l instanceof ComponentModel && l.name === compName)
                  || (this.isComponentObjectModel(l) && this.getComponentObjectModelPropertyValue(l, 'name') === compName)) {
                  return previous
                }
                let previousComponent
                if (l instanceof ComponentModel
                  || this.isComponentObjectModel(l)) {
                  previousComponent = l
                }
                if (l instanceof ComponentModel || this.isComponentObjectModel(l)) {
                  let component
                  if (previousComponent) component =
                    this.getParentComponentConfigThroughAttributes(compName,
                      this.convertToComponentModel(l), this.convertToComponentModel(previousComponent))
                  else component = this.getParentComponentConfigThroughAttributes(compName,
                    this.convertToComponentModel(l), previous)
                  if (component) return component
                }
              }
            }
          }
        }
        if (comp.children !== undefined) {
          for (let j = 0; j < comp.children.length; j++) {
            let previousComponent
            const actualC = comp.children[j]
            if (typeof actualC !== 'string') {
              const componentNow = this.convertToComponentModel(actualC)
              if (componentNow instanceof ComponentModel
                || this.isComponentObjectModel(componentNow)) {
                previousComponent = actualC
              }
              let component
              if (previousComponent) component =
                this.getParentComponentConfigThroughAttributes(compName,
                  componentNow, previousComponent)
              else component =
                this.getParentComponentConfigThroughAttributes(compName,
                  componentNow, previous)
              if (component) {
                return component
              }
            } else {
              // todo als comp string is
              throw new Error('string components not implemented')
            }
          }
        }
      }
    }
    return undefined
  }

  public getAncestorComponentConfig(ancestorName: string, compName: string): ComponentModel | undefined {
    if (ancestorName === compName) throw new Error('component en ancestor can not be the same')
    if (compName === 'content-container') return undefined
    let base = this.getComponentConfig(compName)
    if (!base) base = this.getComponentConfigThroughAttributes(compName)
    if (!base) throw new Error('Component ' + compName + ' not found in configuration')
    // todo parent component methods don't work you just get back the same component over and over bv table => table
    let ancestor = this.getParentComponentConfig(base.name)
    if (!ancestor) ancestor = this.getParentComponentConfigThroughAttributes(base.name) // dit moet altijd iets geven tenzij de cc
    if (!ancestor) throw new Error('Ancestor method is failing')
    if (ancestor.name !== ancestorName) {
      debugger
      return this.getAncestorComponentConfig(ancestorName, ancestor.name)
    }
    return ancestor
  }*/
