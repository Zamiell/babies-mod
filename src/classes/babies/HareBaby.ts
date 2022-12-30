import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  ColorDefault,
  inStartingRoom,
  isEntityMoving,
} from "isaacscript-common";
import { g } from "../../globals";
import { getCurrentBabyDescription } from "../../utilsBaby";
import { Baby } from "../Baby";

/** Takes damage when standing still. */
export class HareBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    const sprite = g.p.GetSprite();
    const framesBeforeTakingDamage = baby.num;

    // This effect should not apply in the starting room to give the player a chance to read the
    // description.
    if (inStartingRoom()) {
      return;
    }

    if (isEntityMoving(g.p, 1)) {
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
      g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
    }
  }
}
