import { Component, OnInit } from '@angular/core';
import {TriggerType} from "../../enums/triggerTypes.enum";
import {Component as AbstractComponent} from "../Component";
import {Toast} from "../../componentclasses/Toast";
import {PropertyName} from "../../enums/PropertyNameTypes.enum";
import {Message} from "primeng/api";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent extends AbstractComponent implements OnInit {

  ngOnInit(): void {
    this.props = Toast.getProperties()
    this.props.forEach((v,k)=>{
      this.storeService.bindToStateProperty(this.name,k,this.index)?.subscribe(res=>{
        this.setPropValue(k,res)
        if(k===PropertyName.message && res){
          this.messageService.add(res as Message)
        }
      })
    })
    this.eventsService.triggerEvent(TriggerType.ComponentReady, this.name)
  }
}
