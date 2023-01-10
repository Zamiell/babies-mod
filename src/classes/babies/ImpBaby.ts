import {
  ButtonAction,
  Direction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  directionToShootAction,
  game,
  isShootAction,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Blender + flight + explosion immunity + blindfolded. */
export class ImpBaby extends Baby {
  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    g.run.babyCounters = Direction.LEFT;
    g.run.babyFrame = gameFrameCount + num;
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // If we rotate the knives on every frame, then it spins too fast.
    if (gameFrameCount < g.run.babyFrame) {
      return;
    }

    g.run.babyFrame += num;

    // Rotate through the four directions.
    g.run.babyCounters++;
    if (g.run.babyCounters > (Direction.DOWN as int)) {
      g.run.babyCounters = Direction.LEFT;
    }
  }

  @CallbackCustom(ModCallbackCustom.INPUT_ACTION_PLAYER)
  inputActionPlayerGetActionValue(
    _player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): number | boolean | undefined {
    if (!isShootAction(buttonAction)) {
      return undefined;
    }

    // The direction is stored in the "babyCounters" variable. It can have these values:
    // - ButtonAction.SHOOT_LEFT (4)
    // - ButtonAction.SHOOT_RIGHT (5)
    // - ButtonAction.SHOOT_UP (6)
    // - ButtonAction.SHOOT_DOWN (7)
    const direction = g.run.babyCounters as Direction;
    const shootAction = directionToShootAction(direction);
    if (shootAction === undefined) {
      return undefined;
    }

    if (buttonAction === shootAction) {
      // Make the player face in this direction.
      return inputHook === InputHook.GET_ACTION_VALUE ? 1 : true;
    }

    return inputHook === InputHook.GET_ACTION_VALUE ? 0 : false;
  }
}
