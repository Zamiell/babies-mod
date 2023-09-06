import type { ButtonAction } from "isaac-typescript-definitions";
import {
  CollectibleType,
  Direction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  directionToShootAction,
  game,
  isShootAction,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    direction: Direction.LEFT,
    nextRotationGameFrame: 0,
  },
};

/** Blender + flight + explosion immunity + blindfolded. */
export class ImpBaby extends Baby {
  v = v;

  /** Epic Fetus overwrites Mom's Knife, which makes the baby not work properly. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.EPIC_FETUS);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // If we rotate the knives on every frame, then it spins too fast.
    if (gameFrameCount < v.run.nextRotationGameFrame) {
      return;
    }
    v.run.nextRotationGameFrame += num;

    // Rotate through the four directions.
    v.run.direction++; // eslint-disable-line isaacscript/strict-enums
    if (v.run.direction > Direction.DOWN) {
      v.run.direction = Direction.LEFT;
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

    const shootAction = directionToShootAction(v.run.direction);
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
