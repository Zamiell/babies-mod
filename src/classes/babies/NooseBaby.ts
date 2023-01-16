import { DamageFlagZero } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_SECOND,
  isShootActionPressed,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Don't shoot when the timer reaches 0. */
export class NooseBaby extends Baby {
  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Set the timer so that we do not take damage immediately upon reaching the floor.
    g.run.babyCounters = gameFrameCount + num;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Shooting when the timer reaches 0 causes damage.
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime > 0) {
      return;
    }

    g.run.babyCounters = gameFrameCount + num * GAME_FRAMES_PER_SECOND; // Reset the timer.
    if (isShootActionPressed(player.ControllerIndex)) {
      player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
    }
  }
}
