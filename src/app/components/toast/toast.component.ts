import { Component, OnInit } from '@angular/core';
import {TriggerType} from "../../enums/triggerTypes.enum";
import {Component as AbstractComponent} from "../Component";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent extends AbstractComponent implements OnInit {

  ngOnInit(): void {
  }
}
