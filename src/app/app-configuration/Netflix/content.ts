import {Container} from "../../components/container/Container";
import {Card} from "../../components/card/Card";
import {Button} from "../../components/button/Button";
import {PropertyName} from "../../enums/PropertyNameTypes.enum";
import UtilFunctions from "../../utils/utilFunctions";
import {Datalink} from "../../design-dimensions/datalink";
import {CursorValues} from "../../enums/cursorValues.enum";
import {RowLayoutConfigModel} from "../../design-dimensions/ComponentSpecificLayout/Container/RowLayoutConfigModel";
import {HorizontalRowLayoutConfigType} from "../../enums/HorizontalRowLayoutConfigTypes.enum";
import {NonCalculatedSizeConfigModel} from "../../design-dimensions/Size/NonCalculatedSizeConfigModel";
import {SizeUnitConfigType} from "../../enums/sizeUnitConfigTypes.enum";

export const content = new Container('content')
const card = new Card('movie-card')
card.structural.smartphone
  .setPropertyByData(PropertyName.title,new Datalink('titel'))
  .setPropertyByData(PropertyName.subtitle,new Datalink('jaar'))
  .setCursor(CursorValues.Pointer)
const btnContainer = new Container('btn-container')
const inList = new Datalink('isInList')
// bij het aanmaken van een button staat de default config voor visible op true
const add = new Button('add')
add.structural.smartphone.label = 'voeg toe'
// dit zal de default waarde voor visible vervolgens gaan vervangen door een waarde
// bepaald door data en deze data wordt door de not functie gejaagd
add.visibility.smartphone.setPropertyByData(PropertyName.visible,inList,[UtilFunctions.not])
const remove = new Button('remove')
remove.structural.smartphone.label = 'verwijder'
remove.visibility.smartphone.setPropertyByData(PropertyName.visible,inList)
btnContainer.setChildren([add,remove])
card.contentInjection.smartphone.footer = btnContainer
card.structural.smartphone.repeater = true
content.size.smartphone.setHeight(new NonCalculatedSizeConfigModel(70,SizeUnitConfigType.Percentage))
content.setChildren([card]);
(content.componentSpecificLayout.smartphone.layout as RowLayoutConfigModel)
  .setHorizontalLayoutOfChildren(HorizontalRowLayoutConfigType.Around)
// todo uitdaging: zorg dat alle cards de breedte hebben voor de breedste card: min-width = custom function
