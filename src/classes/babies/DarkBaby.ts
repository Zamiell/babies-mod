import { ModCallback } from "isaac-typescript-definitions";
import { Callback, setSpriteOpacity, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { newSprite } from "../../sprite";
import { Baby } from "../Baby";

/** Temporary blindness. */
export class DarkBaby extends Baby {
  v = {
    run: {
      counters: 0,
      fadingToBlack: true,
    },
  };

  blackSprite: Sprite | null = null;

  override onAdd(): void {
    this.blackSprite = newSprite("gfx/misc/black.anm2");
  }

  override onRemove(): void {
    this.blackSprite = null;
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // Make the counters tick from 0 --> max --> 0, etc.
    if (this.v.run.fadingToBlack) {
      this.v.run.counters++;
      if (this.v.run.counters === num) {
        this.v.run.fadingToBlack = false;
      }
    } else {
      this.v.run.counters--;
      if (this.v.run.counters === 0) {
        this.v.run.fadingToBlack = true;
      }
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (this.blackSprite === null) {
      return;
    }

    let opacity = g.run.babyCounters / 90;
    if (opacity > 1) {
      opacity = 1;
    }

    setSpriteOpacity(this.blackSprite, opacity);
    this.blackSprite.Render(VectorZero);
  }
}
