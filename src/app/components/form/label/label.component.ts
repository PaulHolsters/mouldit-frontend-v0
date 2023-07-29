import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MarginType} from "../../../enums/marginType.enum";
import {PaddingType} from "../../../enums/paddingType.enum";
import {BorderModel} from "../../../models/BorderModel";
import {BackgroundColorType} from "../../../enums/backgroundColorType.enum";
import {LabelType} from "../../../enums/labelType.enum";
import {FontWeightType} from "../../../enums/fontWeightType.enum";
import {FontSizeType} from "../../../enums/fontSizeType.enum";
import {FontStyleType} from "../../../enums/fontStyleType.enum";
import {TextColorType} from "../../../enums/textColorType.enum";
import {TextDecorationType} from "../../../enums/textDecorationType.enum";
import {Component as AbstractComponent} from "../../Component"
import {PropertyName} from "../../../enums/PropertyNameTypes.enum";

@Component({
  selector: 'm-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent extends AbstractComponent implements OnInit {
  @Input() text:string|undefined
  @Input() backgroundColor: BackgroundColorType|undefined
  @Input() calcHeight: string|undefined
  @Input() calcWidth: string|undefined
  @Input() padding: PaddingType|undefined
  @Input() margin: MarginType|undefined
  @Input() border: BorderModel|undefined
  @Input() labelType: LabelType|undefined
  @ViewChild('label') label:ElementRef|undefined
  FontWeight = FontWeightType
  FontSize = FontSizeType
  FontStyle = FontStyleType
  TextColor = TextColorType
  TextDecoration = TextDecorationType
  PropertyName = PropertyName
  ngOnInit(): void {
  }
  setCalculatedHeight(val:any):boolean{
    if(typeof val === 'string'){
      this.label?.nativeElement.style?.setProperty('--heightVal','calc('+val+')')
      this.setPropValue(PropertyName.height,undefined)
      return true
    }
    this.setPropValue(PropertyName.height,'100%')
    return false
  }
  setCalculatedWidth(val:any):boolean{
    if(typeof val === 'string'){
      this.label?.nativeElement.style?.setProperty('--widthVal','calc('+val+')')
      this.setPropValue(PropertyName.width,undefined)
      return true
    }
    this.setPropValue(PropertyName.width,'100%')
    return false
  }
  getStyleClasses(padding:PaddingType|undefined,margin:MarginType|undefined,
                  border:BorderModel|undefined,backgroundColor:BackgroundColorType|undefined):Object|undefined{
    if(padding && margin && border && backgroundColor)
    return Object.assign(this.stylesService.getPadding(padding),this.stylesService.getMargin(margin),
      this.stylesService.getBorder(border),this.stylesService.getBackgroundColor(backgroundColor))
    return undefined
  }
}
