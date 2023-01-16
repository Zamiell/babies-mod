import { DamageFlagZero } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ColorDefault,
  inStartingRoom,
  isEntityMoving,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Takes damage when standing still. */
export class HareBaby extends Baby {
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
      g.run.babyCounters = 0;
      sprite.Color = ColorDefault;
      return;
    }

    g.run.babyCounters++;
    if (g.run.babyCounters > framesBeforeTakingDamage) {
      g.run.babyCounters = framesBeforeTakingDamage;
    }

    // Show the player gradually changing color to signify that they are about to take damage.
    const distanceToDamage = g.run.babyCounters / framesBeforeTakingDamage; // From 0 to 1
    const colorValue = 1 - distanceToDamage; // They should go from white to black
    sprite.Color = Color(colorValue, colorValue, colorValue);

    if (g.run.babyCounters === framesBeforeTakingDamage) {
      player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
    }
  }
}
