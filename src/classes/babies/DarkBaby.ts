import { ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Temporary blindness. */
export class DarkBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // Make the counters tick from 0 --> max --> 0, etc.
    if (!g.run.babyBool) {
      g.run.babyCounters++;
      if (g.run.babyCounters === num) {
        g.run.babyBool = true;
      }
    } else {
      g.run.babyCounters--;
      if (g.run.babyCounters === 0) {
        g.run.babyBool = false;
      }
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // Set the current fade (which is based on the game's frame count and set in the `POST_UPDATE`
    // callback).
    if (g.run.babySprite !== null) {
      let opacity = g.run.babyCounters / 90;
      if (opacity > 1) {
        opacity = 1;
      }
      g.run.babySprite.Color = Color(1, 1, 1, opacity);
      g.run.babySprite.RenderLayer(0, VectorZero);
    }
  }
}