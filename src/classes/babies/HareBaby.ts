import { DamageFlagZero } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ColorDefault,
  inStartingRoom,
  isEntityMoving,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    numFramesStandingStill: 0,
  },
};

/** Takes damage when standing still. */
export class HareBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const sprite = player.GetSprite();
    const num = this.getAttribute("num");
    const framesBeforeTakingDamage = num;

    // This effect should not apply in the starting room to give the player a chance to read the
    // description.
    if (inStartingRoom()) {
      return;
    }

    if (isEntityMoving(player, 1)) {
      v.room.numFramesStandingStill = 0;
      sprite.Color = ColorDefault;
      return;
    }

    v.room.numFramesStandingStill++;
    v.room.numFramesStandingStill = Math.min(
      v.room.numFramesStandingStill,
      framesBeforeTakingDamage,
    );

    // Show the player gradually changing color to signify that they are about to take damage.
    /** This value is from 0 to 1. */
    const distanceToDamage =
      v.room.numFramesStandingStill / framesBeforeTakingDamage;
    const colorValue = 1 - distanceToDamage; // The player should transition from white to black.
    sprite.Color = Color(colorValue, colorValue, colorValue);

    if (v.room.numFramesStandingStill === framesBeforeTakingDamage) {
      player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
    }
  }
}
