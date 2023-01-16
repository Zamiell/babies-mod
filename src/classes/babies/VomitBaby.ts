import { DamageFlagZero } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Must stand still every 10 seconds. */
export class VomitBaby extends Baby {
  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    g.run.babyCounters = gameFrameCount + num;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Moving when the timer reaches 0 causes damage.
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime <= 0) {
      g.run.babyCounters = gameFrameCount + num * GAME_FRAMES_PER_SECOND; // Reset the timer

      const cutoff = 0.2;
      if (
        player.Velocity.X > cutoff ||
        player.Velocity.X < cutoff * -1 ||
        player.Velocity.Y > cutoff ||
        player.Velocity.Y < cutoff * -1
      ) {
        player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
      }
    }
  }
}
