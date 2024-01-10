import {Effect} from "./Effect";
import {Trigger} from "./Trigger";
import {TriggerType} from "../enums/triggerTypes.enum";
import {Action} from "./Action";
import {ActionType} from "../enums/actionTypes.enum";
import {ServiceType} from "../enums/serviceTypes.enum";
import {NoValueType} from "../enums/NoValueTypes.enum";
import {ActionValueModel} from "../design-dimensions/ActionValueModel";
import {PropertyName} from "../enums/PropertyNameTypes.enum";

export abstract class SystemEffects {
  public static getSystemEffects():Effect[]{
    return [
      new Effect(
        new Trigger(TriggerType.RootComponentReady, 'content-container'),
        new Action('create_store',ActionType.CreateStore,undefined,undefined)
      ),
      new Effect(
        new Trigger(TriggerType.ComponentHide, NoValueType.NO_VALUE_ALLOWED),
        // todo clear values of all controls!!
        new Action('clear_values_of_children',ActionType.SetRenderProperty,
          NoValueType.CALCULATED_BY_ENGINE,
          NoValueType.NO_VALUE_ALLOWED,
          new ActionValueModel(PropertyName.reset, true))
      ),
      // todo zorg dat een action ook getriggered kan worden bij action finished voor een server action ipv enkel een gewone action
      new Effect(
      new Trigger(TriggerType.ActionFinished, 'create_store'),
      new Action('set_RBS',ActionType.SetGlobalResponsiveBehaviour,undefined,undefined)
      ),
      new Effect(
        new Trigger(TriggerType.ClientDataUpdated,ServiceType.DataService),
        new Action('update_data_related_render_properties',ActionType.UpdateDataRelatedProperties)
      ),
      new Effect(
        new Trigger(TriggerType.ClientDataUpdated,ServiceType.DataService),
        new Action('update_data_render_properties',ActionType.UpdateDataProperties)
      ),
      new Effect(
        new Trigger(TriggerType.DataPropertyInitialized,ServiceType.DataService),
        new Action('update_data_depended_render_properties',ActionType.UpdateDataDependedProperties)
      ),
      new Effect(
        new Trigger(TriggerType.IndexUpdated,ServiceType.DataService),
        new Action('set_up_indexed_component',ActionType.SetUpIndexedComponent)
      ),
    ]
  }
}
