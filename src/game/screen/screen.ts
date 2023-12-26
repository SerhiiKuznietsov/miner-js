import { Config } from "../config/game";
import { Face } from "./face";
import { Field } from "./field";

type ClickEventHandler = (e: Event) => void;

export class Screen {
  private _face = new Face();
  private _field: Field;

  constructor(config: Config, leftClickHandler: ClickEventHandler, rightClickHandler: ClickEventHandler) {
    this._field = new Field(config);
    this._field.on("click", leftClickHandler);
    this._field.on("contextmenu", rightClickHandler);
  }

  public init(): void {
    this._face.init();
    this._field.init();
  }
}