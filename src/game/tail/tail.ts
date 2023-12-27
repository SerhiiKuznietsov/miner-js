import { ActionName } from "../actions/actions";
import { StateController } from "../controllers/state-controller";
import { tailStateObservable } from "../observable/tailState";

export class Tail {
  private _stateController: StateController;
  private _id: string;
  private _around: number = 0;

  constructor(stateController: StateController, id: string, around: number) {
    this._stateController = stateController;
    this._id = id;
    this._around = around;
  }

  useAction(actionName: ActionName): string | undefined {
    const activeState = this._stateController.getActive();

    const newStateName = activeState.useAction(actionName);

    if (!newStateName) return;

    const newState = this._stateController.change(newStateName);
    tailStateObservable.notify([newStateName, this._id, this._around]);

    return newState;
  }
}
