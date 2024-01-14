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
import {Message} from "primeng/api";

// todo als de scherm breedte manueel gewijzigd wordt dan gaan bepaalde opstart eigenschappen niet meegenomen worden
//  zoals deze compute property
const setFooterHeight = (stateService: StateService): string => {
  return getComputedStyle(stateService.getValue('menu',PropertyName.elRef).el.nativeElement).height// 50px
}
const setCardWidth = (stateService: StateService): string|undefined => {
  const noc = stateService.getNumberOfComponents('movie-card')
  if(noc>0){
    let widthstr = getComputedStyle(stateService.getValue('movie-card',PropertyName.elRef,0).el.nativeElement.parentElement).width
    let max:number = Number(widthstr.substring(0,widthstr.lastIndexOf('px')))
    for (let i=1;i<noc;i++){
      widthstr = getComputedStyle(stateService.getValue('movie-card',PropertyName.elRef,i).el.nativeElement.parentElement).width
      if(max<Number(widthstr.substring(0,widthstr.lastIndexOf('px')))) max=Number(widthstr.substring(0,widthstr.lastIndexOf('px')))
    }
    return max+'px'
  }
  return undefined
}

const allowDetails = (eventService: EventsService,data:any):boolean =>{
  return !(eventService.hasEffect(['removing movie from my list',data[1]])
    || eventService.hasEffect(['adding movie to my list',data[1]]))
}
const toastConstructMovieAdded = (data:{_id:string,errorcode:number,errorMessage:string;title:string}):Message=>{
  if(data.errorcode!==200&&data.errorcode!==201){
    return {
      severity:'error',
      summary:'Probleem',
      detail:data.errorMessage
    }
  }
  return {
    severity:'success',
    detail:'Film '+data.title+' werd toegevoegd aan jouw lijst'
  }
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
    new Trigger(TriggerType.LastIndexedComponentRendered,'movie-card'),
    new Action(
      'UI-card-width',
      ActionType.SetRenderProperty,
      ['movie-card',true],
      NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.width,setCardWidth)
    )
  ),
  new Effect(
    new Trigger(TriggerType.MenuItemSelected,['menu','films']),
    new ServerAction('GET_films','localhost:4848/films',VerbType.GET,'content')
  ),
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'remove'),
    new ServerAction('DELETE_van_mijn_lijst','localhost:4848/mijn-lijst/remove/659bd2769fd74132944d1171/:_id',VerbType.PUT,'content',undefined),
    'removing movie from my list'
  ),
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'add'),
    new ServerAction('POST_op_mijn_lijst','localhost:4848/mijn-lijst/add/659bd2769fd74132944d1171/:_id',VerbType.PUT,'content',undefined),
    'adding movie to my list'
  ),

  // todo test naderhand of een mislukte serveractie problemen geeft bij de UI update acties uit je configuraties
  //      het is simple: alleen wanneer de return data conform is wordt de UI geupdate anders niet
  new Effect(
    new Trigger(TriggerType.ActionFinished,'POST_op_mijn_lijst'),
    new Action('construct toast object',ActionType.Calculation,undefined,undefined, toastConstructMovieAdded )
  ),

  new Effect(
    new Trigger(TriggerType.ActionFinished,'construct toast object'),
    new Action('show message',ActionType.ShowToastMessage,'toast')
  ),

  //
/*  new Effect(
    new Trigger(TriggerType.ActionFinished,'POST_op_mijn_lijst'),
    new Action('construct condition',ActionType.Calculation,undefined,undefined, setCondition )
  ),
  new Effect(
    new Trigger(TriggerType.ActionFinished,'construct condition'),
    // todo elke action method moet uitgerust worden met een condition parameter op het einde
        als die op true staat moet de data property als wachter gebruikt worden if(data) execute else do not execute
    new Action('do something',ActionType.SendEmail,true)
  ),*/
  new Effect(
    new Trigger(TriggerType.ComponentClicked,'movie-card','movie-card-clicked',allowDetails),
    new Action('showMovieDetails',ActionType.SetRenderProperty,'movie-details-dialog',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.visible, true)/*,CONDITION*/),
    NoValueType.NO_VALUE_NEEDED
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.backgroundColor, BackgroundColorType.Highlight))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderColor, BorderColorType.Primary))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentEntered,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderWidth, BorderWidthType.Width_2))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.backgroundColor, BackgroundColorType.Default))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderColor, BorderColorType.Default))
  ),
  new Effect(
    new Trigger(TriggerType.ComponentLeft,'movie-card'),
    new Action('set background',ActionType.SetRenderProperty,'movie-card',NoValueType.NO_VALUE_ALLOWED,
      new ActionValueModel(PropertyName.borderWidth, BorderWidthType.No_width))
  ),
]
