import {PositionType} from "../../../enums/PositionType.enum";

export class ToastLayoutConfigModel {
  public position: PositionType=PositionType.TopRight
  constructor() {
  }
  setPosition(pos:PositionType):ToastLayoutConfigModel{
    this.position = pos
    return this
  }
}
