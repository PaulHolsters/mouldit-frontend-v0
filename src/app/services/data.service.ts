import {Injectable} from '@angular/core';
import {StoreService} from "./store.service";
import {ConceptComponentModel} from "../models/Data/ConceptComponentModel";
import {ConceptConfigModel} from "../models/Data/ConceptConfigModel";
import {Apollo, gql} from "apollo-angular";
import {QuerySubType} from "../enums/querySubType.enum";
import {TargetType} from "../enums/targetTypes.enum";
import {AttributeComponentModel} from "../models/Data/AttributeComponentModel";
import {NoValueType} from "../enums/no_value_type";
import {MutationType} from "../enums/mutationTypes.enum";
import {AttributeConfigModel} from "../models/Data/AttributeConfigModel";
import {Observable, Subject} from "rxjs";
import {ComponentModel} from "../models/ComponentModel";
import {ComponentType} from "../enums/componentTypes.enum";
import {DataObjectModel} from "../models/DataObjectModel";
import {DataRecordModel} from "../models/DataRecordModel";
import {DataSpecificationType} from "../enums/dataSpecifications.enum";
import {FunctionType} from "../enums/functionTypes.enum";
import utilFunctions from "../utils/utilFunctions";
import {ActionsService} from "./actions.service";
import {ConfigService} from "./config.service";
import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {ActionType} from "../enums/actionTypes.enum";
import {Action} from "../effectclasses/Action";
import {TriggerType} from "../enums/triggerTypes.enum";
import {Effect} from "../effectclasses/Effect";
import {Trigger} from "../effectclasses/Trigger";

@Injectable({
  providedIn: 'root'
})
export class DataService{
  public actionFinished = new Subject()
  constructor(private configService:ConfigService,
              private storeService: StoreService,
              private apollo: Apollo,
              private actionsService:ActionsService) {
    this.actionsService.bindToActionsEmitter.subscribe(res=>{
      this.bindActions()
    })
  }
  public bindActions(){
    this.actionsService.bindToAction(new Action(ActionType.GetBluePrint))?.subscribe(res=>{
      if(res)this.getDataBluePrint(res.effect.action)
    })
    this.actionsService.bindToAction(new Action(ActionType.GetInstance))?.subscribe(res=>{
      if(res){
        if(typeof res.data === 'string'){
          this.getDataByID(res.effect.action,res.data).then(r => {
          })
        }
      }
    })
    this.actionsService.bindToAction(new Action(ActionType.GetAllInstances))?.subscribe(res=>{
      if(res)this.getAllData(res.effect.action).then(r => {

      })
    })
    this.actionsService.bindToAction(new Action(ActionType.DeleteInstance))?.subscribe(res=>{
      if(res){
        let action
        if(res.data.id && typeof res.data.id === 'string') action = this.deleteDataById(res.data.id,res.target)
        else action = this.deleteData(res.data.id)
        if(action){
          action.subscribe((res2: any) => {
              this.actionFinished.next({trigger:TriggerType.ActionFinished,sourceId:res.data.id})
          })
        }
        }})
    this.actionsService.bindToAction(new Action(ActionType.CreateInstance))?.subscribe(res=>{
      if(res)this.persistNewData(res.effect.trigger,res.data).then(r => {

      })
    })
    this.actionsService.bindToAction(new Action(ActionType.UpdateInstance))?.subscribe(res=>{
      if(res)this.persistUpdatedData(res.effect.trigger).then(r => {

      })
    })
  }
  // todo een taal bedenken voor extra calculated fields based on related data and concepts
  // todo a way to filter data
  // todo a way to order data (sort)
  private objectData: ConceptComponentModel[] = []
  private getAllAttributes(compName: string, data: ConceptConfigModel | string[]): string {
    if (data instanceof ConceptConfigModel && data.attributes && data.attributes instanceof Array && data.attributes.length > 0) {
      return data.attributes.map(x => {
        if (x.concept && x.concept.attributes && x.concept.attributes instanceof Array) {
          // todo zie dat je eindeloos kan gaan indien nodig
          return x.name + `{\n${x.concept.attributes.map(attr => attr.name).join('\n')}}`
        }
        return x.name || ''
      }).reduce((x, y) => x += '\n' + y, '')
    } else if (!(data instanceof ConceptConfigModel)) {
      let compConfig = this.configService.getFirstAncestorConfigWithPropertyFromRoot(compName,PropertyName.data)
      if (!compConfig) throw new Error('attributen voor ' + data.toString() + ' en component met naam ' + compName +
        ' werden niet gevonden. Kijk je configuratie na.')
      if (compConfig.data
        && (compConfig.data instanceof ConceptConfigModel)
        && typeof compConfig.data.attributes !== 'string'
        && compConfig.data?.conceptName === data[0]) {
        const concept = compConfig.data.attributes.find(attr => {
          return attr.name === data[1]
        })?.concept
        if (concept && typeof concept.attributes !== 'string') {
          return concept.attributes.map(a => a.name).join('\n')
        }
      } else {
        throw new Error('Attributen niet gevonden. Kijk je configuratie na.')
      }
    }
    throw new Error('Methode getAllAttributes onvolledig of incorrect')
  }
  createExtendedConceptModel(componentName: string, data: DataObjectModel, compConfig: ConceptConfigModel | string[] | ConceptConfigModel[]): ConceptComponentModel | undefined {
    if (compConfig instanceof ConceptConfigModel) {
      let newObj: ConceptComponentModel = {
        conceptName: compConfig.conceptName,
        attributes: [],
        errorMessages: NoValueType.NI,
        conceptBluePrint: data.blueprint,
        conceptData: data.dataSingle ? Object.assign(data.dataSingle,{id:data.dataSingle?.id ?? NoValueType.NA}) : undefined,
        dataList: data.dataMultiple
      }
      const configCopy = {...compConfig}
      if (configCopy.attributes && configCopy.attributes instanceof Array) {
        configCopy.attributes?.forEach(attr => {
          const entry = Object.entries(data.dataSingle ?? {}).find(([k, v]) => {
            return k === attr.name
          })
          const entry2 = Object.entries(data.blueprint ?? {}).find(([k, v]) => {
            return k === attr.name
          })
          const attrExp = {...attr}
          if (entry && attr.name) {
            attrExp.dataServer = entry[1];
          }
          if (entry2 && attr.name) {
            attrExp.dataBlueprint = new Map();
            attrExp.dataBlueprint.set(attr.name, entry2[1]);
          }
          (newObj.attributes as AttributeComponentModel[]).push(Object.assign(attrExp as AttributeComponentModel, {}))
        })
        return newObj
      }
    } else {
      throw new Error('unfinished else condition')
    }
    return undefined
  }
  public updateData(name: string, value: DataRecordModel[] | number | string | undefined, id?: string) {
    // todo id moet meegegeven worden of iets gelijkaardigs zodat
    //      update weet waar het moet zoeken
    debugger
    const parts = name.split('_')
    // todo ook hier wordt nu het verkeerde objecdt genomen
    //      HOOG TIJD OM HIER DUIDELIJKE SELECTIE LOGICA VAN TE MAKEN!
    const obj = this.objectData.find(dataObj => {
      return dataObj.conceptData && dataObj.conceptData.id === id
        || (dataObj.conceptName === parts[0] && !dataObj.dataList) // todo dit is te algemeen als voorwaarde
    })
    debugger
    if (obj && obj.attributes) {
      debugger
      if (parts.length === 2) {
        const attr = (obj.attributes as AttributeConfigModel[]).find(attr => {
          return attr.name === parts[1]
        })
        if (attr) {
          if (attr.text && typeof value === 'string') {
            attr.text.value = value
            attr.dataServer = value
          }
          if (attr.number && typeof value === 'number') {
            attr.number.value = value
            attr.dataServer = value
          }
          if (attr.radio && typeof value === 'string') {
            attr.radio.value = value
            attr.dataServer = value
          }
          if (attr.multiselect && value instanceof Array) {
            attr.multiselect.selectedOptions = value
            attr.dataServer = value
          }
          // todo alle andere datatypes (form controls) => refactor dit is gebonden aan specifieke componenten wat niet goed is

          (obj.attributes as AttributeConfigModel[]).splice((obj.attributes as AttributeConfigModel[]).findIndex(attr => {
            return attr.name === parts[1]
          }), 1, attr)
          this.objectData.splice(this.objectData.findIndex(dataObj => {
            return dataObj.conceptData?.id === id || (dataObj.conceptName === parts[0] && !dataObj.dataList)
          }), 1, obj)
          debugger
        }
      } else {
        // Het gaat om een concept
      }
    }
  }
  private isCorrectType(attr: AttributeComponentModel, componentType: ComponentType): boolean {
    switch (componentType) {
      case ComponentType.MultiSelect:
        return attr.multiselect !== undefined
      case ComponentType.NumberInput:
        return attr.number !== undefined
      case ComponentType.TextInput:
        return attr.text !== undefined
      case ComponentType.RadioButton:
        return attr.radio !== undefined
      default:
        return true
    }
  }
  public getDataObject(dataLink: string[], componentType: ComponentType, dataSpecs: DataSpecificationType[]): AttributeComponentModel | undefined {
    const isDataObject = function(self:DataService,specs:DataSpecificationType[],obj:ConceptComponentModel):boolean{
      let isObj = true
      while (specs.length>0){
        const spec:DataSpecificationType = specs.pop() as DataSpecificationType
        if(!(spec in obj && obj.getValueFor && obj.getValueFor(spec))){
          isObj = false
        }
      }
      return isObj
    }
    const dataLinkCopy = [...dataLink]
    const obj = this.objectData.find(dataObj => {
      return dataObj.conceptName === dataLinkCopy[0]
        // geeft de waarde true terug of false naargelang de dataSpecs
        && isDataObject(this,dataSpecs,dataObj)
/*        && (dataSpecs.reduce(
          (specA, specB) => {
            const copyDataObj = new ConceptComponentModel(
              dataObj.conceptName,
              dataObj.attributes,
              dataObj.errorMessages,
              dataObj.dataList,
              dataObj.conceptData,
              dataObj.conceptBluePrint)
            return ((specA.toString() in copyDataObj && copyDataObj.getValueFor && copyDataObj.getValueFor(specA.toString())) && (specB.toString() in copyDataObj
              && copyDataObj.getValueFor && copyDataObj.getValueFor(specB.toString())))
          }
        ))*/
    })
    if (obj) {
      dataLinkCopy.splice(0, 1)
      let attributes = [...obj.attributes] // leeg bij blueprint
      let currentAttr: AttributeComponentModel | undefined | string = attributes.find(attr => {
        return typeof attr !== 'string' && attr.name === dataLinkCopy[0] && this.isCorrectType(attr, componentType)
      })
      let spliced = dataLinkCopy.splice(0, 1)
      while (currentAttr && dataLinkCopy.length > 0) {
        // todo zoek een use case hiervoor
        //      dit is in het specifieke geval je echt een attribuut wilt hebben in plaats van een volledig concept al
        //      dan niet in een lijst
        if (currentAttr instanceof AttributeComponentModel && currentAttr.concept) {
          // todo ga na of dit echt wel een lijst met attribute component models zijn en geen config models!!!
          attributes = [...currentAttr?.concept?.attributes]
          currentAttr = attributes.find(attr => {
            return typeof attr !== 'string' && attr.name === dataLinkCopy[0] && this.isCorrectType(attr, componentType)
          })
        } else {
          throw new Error('Datalink bevat teveel entries.')
        }
        spliced = dataLinkCopy.splice(0, 1)
      }
      if (currentAttr && typeof currentAttr !== 'string') {
        currentAttr = this.replaceDBIValues(obj, currentAttr)
        currentAttr = this.replaceNVYValues(obj, currentAttr)
        currentAttr = this.pipeValue(obj,currentAttr)
        const [k, v] = Object.entries(obj.conceptBluePrint ?? {}).find(([k, v]) => {
          return k === spliced[0]
        }) ?? []
        if (k) {
          currentAttr.dataBlueprint = new Map([[k, v]])
        }
        return currentAttr
      }
    }
    return undefined
  }
  private calculatePipeValue(radioValue:{label:string,value:string},array:FunctionType[]):{label:string,value:string}{
    let valCopy = {...radioValue}
    array.forEach(func=>{
      switch (func){
        case FunctionType.ToLowerCase:
          valCopy.label = utilFunctions.toLowerCase(valCopy.label)
          break
        case FunctionType.ToUpperCase:
          valCopy.label = utilFunctions.toUpperCase(valCopy.label)
          break
        case FunctionType.CreateSpaces:
          valCopy.label = utilFunctions.createSpaces(valCopy.label)
          break
        case FunctionType.CapitalizeFirstLetter:
          valCopy.label = utilFunctions.capitalizeFirst(valCopy.label)
          break
      }
    })
    return valCopy
  }
  private pipeValue(concept:ConceptComponentModel,attr:AttributeComponentModel):AttributeComponentModel{
    if (attr.radio && attr.radio.pipe instanceof Array) {
      const pipeCopy = attr.radio.pipe
      if(attr.radio.radioValues instanceof Array && pipeCopy)
      attr.radio.radioValues = attr.radio.radioValues.map(val =>{ return this.calculatePipeValue(val,pipeCopy)})
    }
    return attr
  }
  setDataObjectState(nameComponent: string, componentType: ComponentType, dataSpecs: DataSpecificationType[], compConcept?: ConceptComponentModel) {
    this.storeService.getStatePropertySubjects().forEach(propSubj => {
      let comp = this.configService.getConfigFromRoot(propSubj.componentName)
      // todo voorlopig is alle data verondersteld voor elke screensize hetzelfde te zijn => nog aan te passen in de getChildren method
      if (propSubj.propName === 'dataConcept' && comp && comp.data instanceof ConceptConfigModel && comp.name === nameComponent) {
        if(compConcept?.attributes && compConcept?.attributes instanceof Array){
          compConcept.attributes = compConcept.attributes.map(attr=>{
            return this.replaceDBIValues(compConcept,attr)
          })
        }
        propSubj.propValue.next(compConcept)
      } else if (propSubj.propName === 'dataLink' && comp
        && (comp.name === nameComponent||this.configService.isSubComponent(comp.name,nameComponent))
        && comp.attributes?.smartphone?.dataLink && comp.attributes?.smartphone?.dataLink !== NoValueType.NA) {
        const data: AttributeComponentModel | undefined = this.getDataObject(comp.attributes?.smartphone?.dataLink, componentType, dataSpecs)
        this.storeService.getStatePropertySubject(comp.name, 'dataAttribute')?.propValue.next(data)
      }
    })
  }
  private query(querySubType: QuerySubType, compConfig: ComponentModel, id?: string): any {
    switch (querySubType) {
      case QuerySubType.GetDataBluePrint:
        if (compConfig.data instanceof ConceptConfigModel) {
          const GET_BLUEPRINT = `
                    {
                      get${utilFunctions.capitalizeFirst(compConfig.data.conceptName)}(blueprint:true){
                      blueprint{
                        ${this.getAllAttributes(compConfig.name, compConfig.data)}
                      }
                      }
                    }
        `
          return this.apollo
            .watchQuery<any>({
              query: gql`${GET_BLUEPRINT}`
            }).valueChanges
        }
        break
      case QuerySubType.GetDataByID:
        if (compConfig.data instanceof ConceptConfigModel) {
          const GET_BY_ID = `{
        get${utilFunctions.capitalizeFirst(compConfig.data.conceptName)}(id:"${id}",blueprint:true){
        dataSingle{
        id
        ${this.getAllAttributes(compConfig.name, compConfig.data)}
        }
        blueprint{${this.getAllAttributes(compConfig.name, compConfig.data)}}
        }
        }`
          return this.apollo
            .watchQuery<any>({
              query: gql`${GET_BY_ID}`
            }).valueChanges
        }
        break
      case QuerySubType.GetAllData:
        // typisch voor een component zoals een tabel
        if (compConfig.data && !(compConfig.data instanceof ConceptConfigModel)) {
          // dit is voor als je enkel een subconcept nodig zou hebben, mogelijk is dat zelfs nooit het geval
          const GET_ALL = `
                    {
                      get${utilFunctions.capitalizeFirst(compConfig.data[compConfig.data.length - 1])}{
                      id
                        ${this.getAllAttributes(compConfig.name, compConfig.data)}
                      }
                    }
        `
          return this.apollo
            .watchQuery<any>({
              query: gql`${GET_ALL}`
            }).valueChanges
        } else if (compConfig.data instanceof ConceptConfigModel) {
          const GET_ALL = `
                    {
                      get${utilFunctions.capitalizeFirst(compConfig.data.conceptName)}(multiple:true,blueprint:true){
                                            blueprint{
                        ${this.getAllAttributes(compConfig.name, compConfig.data)}
                      }
                              dataMultiple{
                              id
        ${this.getAllAttributes(compConfig.name, compConfig.data)}
        }
                      }
                    }
        `
          return this.apollo
            .watchQuery<any>({
              query: gql`${GET_ALL}`
            }).valueChanges
        }
        break
    }
  }
  private getMutationParams(data: AttributeConfigModel[] | NoValueType.DBI): string {
    // todo refactor: get rid of conditionals => factory pattern!
    if (data === NoValueType.DBI) return ''
    const strVal = data.map(x => {
        return `\
${(x.number?.value || x.text?.value || x.radio?.value || x.multiselect?.selectedOptions) ? (x.name + ':' || '') : ''}\
${(x.text?.value) ? '"' : (x.multiselect?.selectedOptions) ? '[' : ''}${(x.multiselect?.selectedOptions?.length ?? 0) > 0 ? '"' : ''}\
${(x.number?.value || x.text?.value || x.radio?.value || x.multiselect?.selectedOptions?.map(opt => {
          return opt.id
        }).join('","')) || ''}${(x.multiselect?.selectedOptions?.length ?? 0) > 0 ? '"' : ''}\
${(x.text?.value) ? '"' : (x.multiselect?.selectedOptions) ? ']' : ''}
`
      }
    )
      .reduce((x, y) => x += `,` + y).trim()
    // todo zorg nog voor een meer ordelijke GQL string hier
    return strVal.charAt(strVal.length - 1) === ',' ? strVal.substring(0, strVal.length - 1) : strVal
  }
  private mutate(mutationStr:string): Observable<any> | undefined {
    return this.apollo
      .mutate({
        mutation: gql`${mutationStr}`
      }) as unknown as Observable<any>
  }
  private getMutationObject(){

  }
  private createMutationStr(data: ConceptConfigModel | string[] | undefined, verb: MutationType,id?:string, dataFromServer?: DataRecordModel): string {
    if (data instanceof ConceptConfigModel) {
      const currentData = this.objectData.find(dataObj => {
        return dataObj.conceptName === data.conceptName
      })
      // todo ik vermoed dat dit een create is ...
      if (currentData) {
        return `mutation Mutation {
              ${verb}${utilFunctions.capitalizeFirst(data.conceptName)}(${this.getMutationParams(data.attributes)}) {
                    dataSingle{id}
              }
            }`
      }
      // todo en dit een update ...
    } else if(id){
      return `mutation Mutation {
              ${verb}${dataFromServer?.__typename.substring(0,dataFromServer?.__typename.length-4)}(id:"${id}") {
                    dataSingle{id}
              }
            }`
    }
    throw new Error('Geen geldige data configuratie.')
    // todo maar naast een create single zou je ook een create multiple kunnen hebben en zelfs een update multiple
    // todo en een delete zie ik hier precies niet dus als die er is is dt absoluut niet duidelijk en expliciet (genoeg)
    //      of liever de verb bepaald diet maar daarna is er een hoop onduidelijke mumbojumbo met parameters en methodes
    //      waarbij het niet duidelijk is wat dit doet en wat de relatie met de VERB parameter is
    //
  }
  private replaceDBIValues(concept: ConceptComponentModel, attr: AttributeComponentModel): AttributeComponentModel {
    const bp = attr.dataBlueprint?.get(attr.name)
    if (attr.radio) {
      if (attr.radio.conceptName === NoValueType.DBI) {
        attr.radio.conceptName = concept.conceptName
      }
      if (attr.radio.radioValues === NoValueType.DBI) {
        if (bp && typeof bp === 'string' && bp.indexOf('enumVal') !== -1) {
          const arr1Temp = bp.split('},{enumVal:')
          if (arr1Temp.length > 0 && typeof arr1Temp[0] === 'string')
            arr1Temp[0] = arr1Temp[0].substring(9)
          arr1Temp[arr1Temp.length - 1] = arr1Temp[arr1Temp.length - 1].substring(0, arr1Temp[arr1Temp.length - 1].length - 1)
          const arr2Temp = arr1Temp.map(el => el.trim()).map(el=>{
            return {label:el,value:el}
          })
          attr.radio.radioValues = [...arr2Temp]
        }
      }
    } else if (attr.multiselect) {
      if (attr.multiselect.conceptName === NoValueType.DBI) {
        attr.multiselect.conceptName = concept.conceptName
      }
      if (attr.multiselect.options === NoValueType.DBI) {
        if (bp instanceof Array) {
          attr.multiselect.options = [...bp]
        }
      }
      if (attr.multiselect.optionLabel === NoValueType.DBI) {
        // todo ik stel voor dat standaard altijd de eerste property wordt genomen => later implementeren nu staat er automatisch 'name'
      }
    }
    if(attr.tableColumn){
      if(attr.tableColumn.label === NoValueType.DBI){
        attr.tableColumn.label = utilFunctions.capitalizeFirst(attr.name)
      }
      // todo voor het gebruik van een functie zou je een function value type kunnen aanmaken?
      //    vervang novaluetype maar gewoon gelijk door valuetype
    }
    return attr
  }
  private replaceNVYValues(concept: ConceptComponentModel, attr: AttributeComponentModel): AttributeComponentModel {
    if (attr.text && attr.text.value === NoValueType.NVY && attr.dataServer && typeof attr.dataServer === 'string') {
      attr.text.value = attr.dataServer
    }
    if (attr.number && attr.number.value === NoValueType.NVY && attr.dataServer && typeof attr.dataServer === 'number') {
      attr.number.value = attr.dataServer
    }
    if (attr.radio && attr.radio.value === NoValueType.NVY && attr.dataServer && typeof attr.dataServer === 'string') {
      attr.radio.value = attr.dataServer
    }
    if (attr.multiselect && attr.multiselect.selectedOptions.length === 0 && attr.dataServer && attr.dataServer instanceof Array) {
      attr.multiselect.selectedOptions = attr.dataServer
    }
    return attr
  }
  public async persistNewData(trigger: Trigger,data:DataRecordModel) {
    let comp = this.configService.getFirstAncestorConfigWithPropertyFromRoot(trigger.source, PropertyName.data)
    await this.mutate(this.createMutationStr(comp?.data, MutationType.Create,data))?.subscribe(res => {
      console.log(res, 'yeah!')
    })
  }
  public async persistUpdatedData(trigger: Trigger) {
    let comp = this.configService.getFirstAncestorConfigWithPropertyFromRoot(trigger.source, PropertyName.data)
    if (comp && comp.data && comp.data instanceof ConceptConfigModel && comp.data.conceptName) {
      const cname = comp.data.conceptName
      const conceptId = this.objectData.find(d => {
        return d.conceptName === cname && d.conceptData?.id && d.conceptData.id !== NoValueType.NA
      })?.conceptData?.id
      if (conceptId) {
        await this.mutate(comp?.data, MutationType.Update, conceptId)?.subscribe(res => {
          console.log(res, 'yeah!')
        })
      }
    } else throw new Error('No valid conceptId could be found')
  }
  public deleteDataById( id: string, target: EventTarget | undefined){
    return this.mutate(undefined, MutationType.Delete, id)
  }
  public deleteData(trigger: Trigger) {
    let comp = this.configService.getFirstAncestorConfigWithPropertyFromRoot(trigger.source, PropertyName.data)
    if (comp && comp.data && comp.data instanceof ConceptConfigModel && comp.data.conceptName) {
      const cname = comp.data.conceptName
      let conceptId
      const dataObj = this.objectData.find(d => {
        return d.conceptName === cname && (d.conceptData?.id && d.conceptData.id !== NoValueType.NA)||(d.conceptBluePrint&&
          typeof d.attributes !== 'string' &&
          d.attributes.find(attr=>{
            if(attr.name === 'id' && attr?.text?.value && attr.text.value !== NoValueType.NA){
              conceptId = attr.text.value
              return true
            }
            return false
          }))
      })
      if(!conceptId) conceptId = dataObj?.conceptData?.id
      if (conceptId) {
        return this.mutate(comp?.data, MutationType.Delete, conceptId)
      } else return undefined
    } else throw new Error('No valid conceptId could be found')
  }
  public getDataBluePrint(action: Action) {
    if (action.targetType === TargetType.Client) {
      let compModel = this.configService.getConfigFromRoot(action.target)
      if (compModel !== undefined) {
        this.query(QuerySubType.GetDataBluePrint, compModel).subscribe((res: unknown) => {
          if (res && typeof res === 'object' && res.hasOwnProperty('data') && compModel?.data) {
            const bluePrintData = (res as { data: {} })['data']
            const value = Object.values(bluePrintData)[0] as DataObjectModel
            const compObj = this.createExtendedConceptModel(action.target, value, compModel.data)
            if (compObj) {
              this.objectData.push(compObj)
              this.setDataObjectState(compModel.name, compModel.type, [DataSpecificationType.Blueprint], compObj)
            }
          }
        })
      }
    }
  }
  public async getAllData(action: Action) {
    if (action.targetType === TargetType.Client) {
      let comp = this.configService.getConfigFromRoot(action.target)
      if (comp && comp.data) {
        await this.query(QuerySubType.GetAllData, comp).subscribe((res: unknown) => {
          if (res && typeof res === 'object' && res.hasOwnProperty('data') && comp?.data) {
            const allData = (res as { data: {} })['data']
            const data = Object.values(allData)[0] as DataObjectModel
            const compObj = this.createExtendedConceptModel(action.target, data, comp.data)
            const error = compObj?.dataList?.includes(null) || compObj?.dataList === null
              || compObj?.conceptBluePrint === null || (compObj?.conceptBluePrint &&  Object.values(compObj?.conceptBluePrint).includes(null))
            if (comp.data && !(comp.data instanceof ConceptConfigModel) && !error) {
              const attributeModel = this.getDataObject(comp.data, comp.type, [DataSpecificationType.DataList])
              // TODO ik denk niet dat een datalist nog nodig is
              if (attributeModel) {
                attributeModel.dataList = []
                data?.dataMultiple?.forEach(record => {
                  if (comp && comp.data && !(comp.data instanceof ConceptConfigModel)) {
                    attributeModel?.dataList?.push(record)
                  }
                })
                this.setDataObjectState(comp.name, comp.type, [DataSpecificationType.DataList])
              }
            } else if (compObj && !error) {
              this.objectData.push(compObj)
              this.setDataObjectState(comp.name, comp.type, [DataSpecificationType.DataList], compObj)
            } else throw new Error('Error on the graphQL server')
          }
        })
      }
    }
    // todo maak een flow waarbij je data kan doorpompen naar een volgende actie
  }
  public saveData(compObj:ConceptComponentModel){
    this.objectData.push(compObj)
  }
  public async getDataByID(action: Action, id: string) {
    if (action.targetType === TargetType.Client) {
      let comp = this.configService.getConfigFromRoot(action.target)
      if (comp !== undefined && comp.data) {
        await this.query(QuerySubType.GetDataByID, comp, id).subscribe((res: unknown) => {
          if (res && typeof res === 'object' && res.hasOwnProperty('data') && comp?.data) {
            const dataByID = (res as { data: {} })['data']
            const data = Object.values(dataByID)[0] as DataObjectModel
            // todo in deze methode zal voor beide dataobjecten de formcontrols referen naar dezelfde data in het geheugen
            // todo dit stukje herbruiken in initialize form waarbij eerst wordt gepusht dan geset
            const compObj = this.createExtendedConceptModel(action.target, data, comp.data)
            const error = compObj?.conceptData === undefined
              || compObj?.conceptBluePrint === null || (compObj?.conceptBluePrint &&  Object.values(compObj?.conceptBluePrint).includes(null))
            if (compObj && !error) {
              this.saveData(compObj)
              this.setDataObjectState(comp.name, comp.type, [DataSpecificationType.Id, DataSpecificationType.Blueprint], compObj)
              // todo bij error de desbtreffende component vervangen door een standaard errortext component
            } else throw new Error('Error on the graphQL server: voor het id '+id+' bestaat geen record (meer). Mogelijks is het verwijderd geweest door een ' +
              'andere gebruiker.')
          }
        })
      }
    }
    // todo maak een flow waarbij je data kan doorpompen naar een volgende actie
  }
}
