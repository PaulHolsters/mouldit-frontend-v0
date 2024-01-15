import { Component, OnInit } from '@angular/core';
import {TriggerType} from "../../enums/triggerTypes.enum";
import {Component as AbstractComponent} from "../Component";
import {Toast} from "../../componentclasses/Toast";
import {PropertyName} from "../../enums/PropertyNameTypes.enum";
import {Message} from "primeng/api";
import {ComponentModelType} from "../../types/union-types";
import {isComponentModelType} from "../../types/type-aliases";

@Component({
  selector: 'm-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent extends AbstractComponent implements OnInit {

  templateComponent:ComponentModelType|undefined
  ngOnInit(): void {
    this.props = Toast.getProperties()
    this.props.forEach((v,k)=>{
      this.storeService.bindToStateProperty(this.name,k,this.index)?.subscribe(res=>{
        this.setPropValue(k,res)
        if(k===PropertyName.templateComponent && isComponentModelType(res,this.configService)){
          this.templateComponent = res
        }
        if(k===PropertyName.message && res){
          this.messageService.add({key:this.name,...res as Message})
        }

      })
    })
    this.eventsService.triggerEvent(TriggerType.ComponentReady, this.name)
  }
}
