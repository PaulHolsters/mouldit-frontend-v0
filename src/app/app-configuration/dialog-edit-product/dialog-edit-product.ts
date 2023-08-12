import {ComponentModel} from "../../models/ComponentModel";
import {ComponentType} from "../../enums/componentTypes.enum";
import {ResponsiveAttributesConfigModel} from "../../models/Attributes/ResponsiveAttributesConfigModel";
import {AttributesConfigPropsModel} from "../../models/Attributes/AttributesConfigPropsModel";
import {NoValueType} from "../../enums/no_value_type";
import {ResponsiveVisibilityConfigModel} from "../../models/Visibility/ResponsiveVisibilityConfigModel";
import {VisibilityConfigPropsModel} from "../../models/Visibility/VisibilityConfigPropsModel";
import {
  ResponsiveContentInjectionConfigModel
} from "../../models/ContentInjection/ResponsiveContentInjectionConfigModel";
import {ContentInjectionConfigPropsModel} from "../../models/ContentInjection/ContentInjectionConfigPropsModel";
import {formEditProduct} from "../form-edit-product/form";

export const dialogEditProduct =
  new ComponentModel('edit-product-dialog',
    ComponentType.Dialog,undefined,undefined,undefined,
    new ResponsiveAttributesConfigModel(
      new AttributesConfigPropsModel(
        NoValueType.NA,
        NoValueType.NA,
        NoValueType.NA,
        NoValueType.NA,
        NoValueType.NA,
        NoValueType.NA,
        'Aanpassen product'
      )
    ),
    new ResponsiveVisibilityConfigModel(new VisibilityConfigPropsModel(false,false)),
    undefined,
    undefined,
    undefined,
    undefined,
    // todo die form wordt niet opgepikt in de frontend
    new ResponsiveContentInjectionConfigModel(new ContentInjectionConfigPropsModel(NoValueType.NA,NoValueType.NA,formEditProduct))
  )
