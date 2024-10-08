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
  hasCollectible,
  isBeforeGameFrame,
  isShootAction,
} from "isaacscript-common";
import { BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
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

  override isValid(player: EntityPlayer): boolean {
    // Epic Fetus overwrites Mom's Knife, which makes the baby not work properly.
    return !hasCollectible(
      player,
      ...BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
      CollectibleType.EPIC_FETUS,
    );
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // If we rotate the knives on every frame, then it spins too fast.
    if (isBeforeGameFrame(v.run.nextRotationGameFrame)) {
      return;
    }
    v.run.nextRotationGameFrame += num;

    // Rotate through the four directions.
    v.run.direction++; // eslint-disable-line complete/strict-enums
    if (v.run.direction > Direction.DOWN) {
      v.run.direction = Direction.LEFT;
    }
  }

  @CallbackCustom(ModCallbackCustom.INPUT_ACTION_PLAYER)
  inputActionPlayer(
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
