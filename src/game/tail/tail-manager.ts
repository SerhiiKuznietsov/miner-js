import { ActionName, ActionNamesList } from "../actions/actions";
import { Config } from "../config/game";
import { Vector2 } from "../geometry/vector2";
import { spawnTailMatrix } from "./matrix/matrix";
import { GameEvent, gameObserver } from "../observable/game";
import { StateNamesList } from "../states/type/type";
import { createId, parseId } from "../utils/id";
import { Tail } from "./tail";

export class TailManager {
  private _tails = new Map<string, Tail>();
  private _config: Config;
  private _openField: number = 0;

  constructor(config: Config) {
    this._config = config;
  }

  private get(id: string): Tail {
    const tail = this._tails.get(id);

    if (!tail) {
      throw new Error(`Tail with id: ${id} not found`);
    }

    return tail;
  }

  private clear(): void {
    this._tails.clear();
  }

  public init(vector2?: Vector2): void {
    this.clear();

    const tailMatrix = spawnTailMatrix(this._config, vector2);

    tailMatrix.forEach((tailMatrixItem) => {
      const [id, StateController, around] = tailMatrixItem;

      this._tails.set(id, new Tail(StateController, id, around));
    });
  }

  public useActionById(id: string, actionName: ActionName): void {
    const newState = this.get(id).useAction(actionName);

    if (newState === StateNamesList.redMineState) {
      gameObserver.notify(GameEvent.lose);
    }

    this.openAround(id, newState);

    if (this._openField === this._config.needToOpen) {
      gameObserver.notify(GameEvent.win);
    }
  }

  private openAround(id: string, newState: string | undefined): void {
    const [x, y] = parseId(id);

    if (
      newState === StateNamesList.emptyState ||
      newState === StateNamesList.aroundState
    ) {
      this._openField++;
    }

    if (newState !== StateNamesList.emptyState) return;

    for (let i = x > 0 ? x - 1 : x; i <= x + 1 && i < this._config.cols; i++) {
      for (
        let j = y > 0 ? y - 1 : y;
        j <= y + 1 && j < this._config.rows;
        j++
      ) {
        const newId = createId(i, j);
        const newState = this.get(newId).useAction(ActionNamesList.calc);

        this.openAround(newId, newState);
      }
    }
  }
}
