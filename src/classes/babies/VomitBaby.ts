import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Must stand still every 10 seconds. */
export class VomitBaby extends Baby {
  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    g.run.babyCounters = gameFrameCount + num;
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Moving when the timer reaches 0 causes damage.
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime <= 0) {
      g.run.babyCounters = gameFrameCount + num * GAME_FRAMES_PER_SECOND; // Reset the timer

      const cutoff = 0.2;
      if (
        g.p.Velocity.X > cutoff ||
        g.p.Velocity.X < cutoff * -1 ||
        g.p.Velocity.Y > cutoff ||
        g.p.Velocity.Y < cutoff * -1
      ) {
        g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
      }
    }
  }
}
