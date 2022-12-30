import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  isShootActionPressedOnAnyInput,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Don't shoot when the timer reaches 0. */
export class NooseBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const time = this.getAttribute("time");

    // Shooting when the timer reaches 0 causes damage.
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime > 0) {
      return;
    }

    g.run.babyCounters = gameFrameCount + time; // Reset the timer
    if (isShootActionPressedOnAnyInput()) {
      g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
    }
  }
}
