import {Effect} from "../../effectclasses/Effect";
import {TriggerType} from "../../enums/triggerTypes.enum";
import {Action} from "../../effectclasses/Action";
import {ActionType} from "../../enums/actionTypes.enum";
import {NoValueType} from "../../enums/NoValueTypes.enum";
import {StateService} from "../../services/state.service";
import {PropertyName} from "../../enums/PropertyNameTypes.enum";
import {ActionValueModel} from "../../design-dimensions/ActionValueModel";
import {Trigger} from "../../effectclasses/Trigger";
import {ServerAction} from "../../effectclasses/ServerAction";
import {EventsService} from "../../services/events.service";
import {BackgroundColorType} from "../../enums/backgroundColorType.enum";
import {BorderColorType} from "../../enums/borderColorType.enum";
import {BorderWidthType} from "../../enums/borderWidthType.enum";
import {VerbType} from "../../enums/VerbTypes.enum";

// todo als de scherm breedte manueel gewijzigd wordt dan gaan bepaalde opstart eigenschappen niet meegenomen worden
//  zoals deze compute property
const setFooterHeight = (stateService: StateService, data: any): string => {
  return getComputedStyle(data.el.nativeElement).height // 50px
}
const allowDetails = (eventService: EventsService,data:any):boolean =>{
  return !(eventService.hasEffect(['removing movie from my list',data[1]])
    || eventService.hasEffect(['adding movie to my list',data[1]]))
}
export const effects: Effect[] = [
  new Effect(
    new Trigger(TriggerType.ComponentReady,'menu'),
    // todo maak verschillende soorten acties zodat je nergens als parameter een novaluetype moet meegeven
    new Action(
      'UI-setFooterHeight',
      ActionType.SetRenderProperty,
      'footer',
      NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.height,setFooterHeight))),
  new Effect(
    new Trigger(TriggerType.MenuItemSelected,['menu','films']),
    new ServerAction('GET_films','localhost:4848/films',VerbType.GET,'content')
  ),
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'remove'),
    new ServerAction('DELETE_van_mijn_lijst','localhost:4848/mijn-lijst',VerbType.DELETE,'content',undefined,'id'),
    'removing movie from my list'
  ),
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'add'),
    new ServerAction('POST_op_mijn_lijst','localhost:4848/mijn-lijst',VerbType.PUT,'content',undefined,'id'),
    'adding movie to my list'
  ),
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'movie','movie-card-clicked',allowDetails),
    new Action('showMovieDetails',ActionType.SetRenderProperty,'movie-details-dialog',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.visible, true)),
    NoValueType.NO_VALUE_NEEDED
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.backgroundColor, BackgroundColorType.Highlight))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderColor, BorderColorType.Primary))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderWidth, BorderWidthType.Width_2))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.backgroundColor, BackgroundColorType.Default))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderColor, BorderColorType.Default))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie'),
    new Action('set background',ActionType.SetRenderProperty,'movie',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderWidth, BorderWidthType.No_width))
  ),
]
