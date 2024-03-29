import {NonCalculatedSizeConfigModel} from "../NonCalculatedSizeConfigModel";
import {CalculatedSizeConfigModel} from "../CalculatedSizeConfigModel";
import {ParentConfigType} from "../../../enums/ParentConfigTypes.enum";

export class IconSizeConfigModel {

  constructor(public size:
                NonCalculatedSizeConfigModel |
                CalculatedSizeConfigModel |
                ParentConfigType.static){
  }
  // todo dit is een typisch geval van een component specifieke sizing die wellicht gedeeld kan worden met andere componenten
  //      in de UI component zelf komt dit overeen met de css fontsize style property
  //      on compile time zou dit moeten nagaan of je wel de juiste component hebt gebruikt hiervoor
  setSize(size:
            NonCalculatedSizeConfigModel |
            CalculatedSizeConfigModel |
            ParentConfigType.static){
    this.size = size
    return this
  }

}
