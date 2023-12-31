import { IInterfaceObject } from "../logic";
import { timeObserver } from "../observable/time";
import { Timer } from "../managers/timer";

export class TimerManager implements IInterfaceObject {
  private _timer = new Timer(this.updateTime.bind(this));

  private updateTime(time: string): void {
    timeObserver.notify(time);
  }

  public init(): void {
    this._timer.init();
  }

  public restart(): void {
    this._timer.init();
  }

  public start(): void {
    this._timer.init();
    this._timer.on();
  }

  public end(): void {
    this._timer.off();
  }
}
