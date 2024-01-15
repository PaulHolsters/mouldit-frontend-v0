import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {TriggerType} from "../enums/triggerTypes.enum";
import {ActionIdType, EffectIdType} from "../types/type-aliases";
import {ActionsService} from "./actions.service";
import {Action} from "../effectclasses/Action";
import {ActionType} from "../enums/actionTypes.enum";
import {Effect} from "../effectclasses/Effect";
import {ResponsiveSizeConfigModel} from "../design-dimensions/Size/ResponsiveSizeConfigModel";
import {ResponsiveOverflowConfigModel} from "../design-dimensions/Overflow/ResponsiveOverflowConfigModel";
import {
  ResponsiveContainerChildLayoutConfigModel
} from "../design-dimensions/ComponentSpecificLayout/Container/ResponsiveContainerChildLayoutConfigModel";
import {ResponsiveVisibilityConfigModel} from "../design-dimensions/Visibility/ResponsiveVisibilityConfigModel";
import {ActionValueModel} from "../design-dimensions/ActionValueModel";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  public actionFinished = new Subject<{ trigger: TriggerType.ActionFinished, source: ActionIdType, value: unknown }>()

  constructor(private actionsService: ActionsService, private stateService: StateService) {
    this.actionsService.bindToActionsEmitter.subscribe(res => {
      this.bindActions()
    })
  }

  public bindActions() {
    this.actionsService.bindToAction(new Action('', ActionType.Calculation))?.subscribe(res => {
      if (res && res.effect.action instanceof Action) {
        this.actionFinished.next({
          trigger: TriggerType.ActionFinished, source: res.effect.action.id,
          value: this.calculate({action: res.effect.action, data: res.data})
        })
      }
    })
  }

  private calculate(input: { action: Action, data: Object }): unknown {
    // effect.action bevat de manipulatie, data bevat het JS object dat je als parameter voor de manipulatie moet gebruiken
    if (typeof (input.action.value) === 'function') {
      return (input.action.value)(input.data, this.stateService)
    }
    throw new Error('calculation action must contain a manipulation function')
  }

}
