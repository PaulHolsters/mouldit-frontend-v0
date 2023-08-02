import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Component as AbstractComponent} from "../Component";
import {PropertyName} from "../../enums/PropertyNameTypes.enum";
import {PaddingType} from "../../enums/paddingType.enum";
import {NoValueType} from "../../enums/no_value_type";
import {MarginType} from "../../enums/marginType.enum";
import {EventType} from "../../enums/eventTypes.enum";
import {Icon} from "../../componentclasses/Icon";

@Component({
  selector: 'm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent extends AbstractComponent implements OnInit,AfterViewInit  {
  @ViewChild('icon') icon:ElementRef|undefined
  ngOnInit(): void {
    this.props = Icon.getProperties()
    this.props.forEach((v,k)=>{
      this.storeService.bindToStateProperty(this.name,k)?.subscribe(res=>{
        this.setPropValue(k,res)
      })
    })
    this.eventsService.triggerEvent(EventType.ComponentReady, this.name)
  }
  setCalculatedHeight(val:any):boolean{
    if(typeof val === 'string'){
      this.icon?.nativeElement.style?.setProperty('--heightVal','calc('+val+')')
      this.setPropValue(PropertyName.height,undefined)
      return true
    }
    this.setPropValue(PropertyName.height,'100%')
    return false
  }
  setCalculatedWidth(val:any):boolean{
    if(typeof val === 'string'){
      this.icon?.nativeElement.style?.setProperty('--widthVal','calc('+val+')')
      this.setPropValue(PropertyName.width,undefined)
      return true
    }
    this.setPropValue(PropertyName.width,'100%')
    return false
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges()
  }
  getStyleClasses(
    padding:PaddingType|NoValueType.NA,
    margin:MarginType|NoValueType.NA):Object|undefined{
    return this.stylesService.getStyleClasses(padding,margin,NoValueType.NA, NoValueType.NA)
  }
}
