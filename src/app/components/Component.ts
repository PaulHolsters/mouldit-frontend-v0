import utilFunctions from "../utils/utilFunctions";
import {StateService} from "../services/state.service";
import {RenderPropertiesService} from "../services/renderProperties.service";
import {EventsService} from "../services/events.service";
import {ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, SimpleChanges} from "@angular/core";
import {TriggerType} from "../enums/triggerTypes.enum";
import {PropertyName} from "../enums/PropertyNameTypes.enum";
import {ComponentType} from "../enums/componentTypes.enum";
import {InputFontSizeType} from "../enums/inputFontSizeType.enum";
import {RestrictionType} from "../enums/restrictionType.enum";
import {FontWeightType} from "../enums/fontWeightType.enum";
import {FontSizeType} from "../enums/fontSizeType.enum";
import {FontStyleType} from "../enums/fontStyleType.enum";
import {TextColorType} from "../enums/textColorType.enum";
import {TextDecorationType} from "../enums/textDecorationType.enum";
import {ConfirmationService, MessageService} from "primeng/api";
import {ClientDataService} from "../services/data/client/client-data.service";
import {ConfigService} from "../services/config.service";
import {ServiceType} from "../enums/serviceTypes.enum";
import {ResponsiveBehaviourService} from "../services/responsive-behaviour.service";
import {PropsByDataType} from "../types/type-aliases";

@Directive()
export class Component implements OnChanges {
  @Input() public name!: string
  @Input() public index: number | undefined
  @Input() data: any | undefined
  constructor(
    protected element: ElementRef,
    protected cd: ChangeDetectorRef,
    protected stateService: StateService,
    protected storeService: RenderPropertiesService,
    protected eventsService: EventsService,
    protected clientDataService: ClientDataService,
    protected confirmationService: ConfirmationService,
    protected configService: ConfigService,
    protected messageService: MessageService,
    protected rbs: ResponsiveBehaviourService) {
  }
  protected props: Map<string, any> | undefined
  protected readonly TriggerType = TriggerType
  protected readonly PropertyName = PropertyName
  protected readonly ComponentType = ComponentType
  protected readonly RestrictionType = RestrictionType
  protected readonly InputFontSizeType = InputFontSizeType
  protected readonly Math = Math
  protected readonly FontWeightType = FontWeightType
  protected readonly FontSizeType = FontSizeType
  protected readonly FontStyleType = FontStyleType
  protected readonly TextColorType = TextColorType
  protected readonly TextDecorationType = TextDecorationType
  getPropValue(key: string, index?: number) {
    return typeof index === 'number' && this.props?.get(key) ? this.props?.get(key)[index] : this.props?.get(key)
  }
  trigger(trigger: TriggerType, nativeEvent?: any) {
    this.eventsService.triggerEvent(trigger, [this.name,this.index], this.data, nativeEvent?.target)
  }
  setPropValue(key: string, value: any, setProps?: string[], useProps?: { prop: string, use: string }[]) {
    if (this.props) {
      if (!utilFunctions.areEqual(this.props.get(key), value)) {
        if (key === PropertyName.propsByData && this.data) {
          // todo haal wat je in ui doet naar hier
          let existingDataByProps // dit is dan al onmiddellijk de nieuwe
            = this.stateService.getValue(this.name, PropertyName.propsByData, this.index) as PropsByDataType|null
          (value as PropsByDataType).forEach((v) => {
            const existing = (existingDataByProps)?.findIndex(val => {
              return val[0] === v[0]
            })
            if (existing === -1) {
              // de array aanpassen past wegens reference ook de onderliggende waarde in de props map aan
              existingDataByProps?.push(v)
            } else if(existing) {
              // todo testen of deze tak degelijk werkt
              existingDataByProps?.splice(existing, 1, v)
            }
          })
          if(existingDataByProps)  value = existingDataByProps
          this.props.set(key, value)
          // todo fix bug sync data method => not working well with index
          this.stateService.syncData(this.name, {key: key, value: value}, this.index)
          // nu is existing de nieuwe
          if (typeof this.index === 'number') {
            this.eventsService.triggerEvent(TriggerType.DataPropertyInitialized, ServiceType.DataService, [[this.name, this.index], [value, this.data]])
          } else {
            this.eventsService.triggerEvent(TriggerType.DataPropertyInitialized, ServiceType.DataService, [this.name, [value, this.data]])
          }
        } else{
          this.props.set(key, value)
          this.stateService.syncData(this.name, {key: key, value: value}, this.index)
        }
        if (setProps) {
          setProps.forEach(p => {
            if (this.props && typeof value === 'object' && value.hasOwnProperty(p) && !utilFunctions.areEqual(this.props.get(p), value[p])) {
              this.props.set(p, value[p])
              this.stateService.syncData(this.name, {key: p, value: this.getPropValue(p)}, this.index)
            }
          })
        }
        if (useProps) {
          useProps.forEach(p => {
            if (this.props && typeof value === 'object'
              && !utilFunctions.areEqual(this.props.get(p.prop), this.props.get(p.use))) {
              this.props.set(p.prop, this.props.get(p.use))
              this.stateService.syncData(this.name, {key: p.prop, value: this.getPropValue(p.prop)}, this.index)
            }
          })
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.index === 'number' && this.name) {
      this.eventsService.triggerEvent(TriggerType.IndexUpdated, ServiceType.DataService, [this.name, this.index])
    }
    if(this.data && this.getPropValue(PropertyName.propsByDataObject)){
      // todo zet de nodige waarden in this.props en zet waarden in init enkel nog indien deze niet in propByDataObject voorkomen => maw algemene component
    }
  }

}
