import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  newSprite,
  setSpriteOpacity,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    counters: 0,
    fadingToBlack: true,
  },
};

let blackSprite: Sprite | undefined;

/** Temporary blindness. */
export class DarkBaby extends Baby {
  v = v;

  override onAdd(): void {
    blackSprite = newSprite("gfx/misc/black.anm2");
  }

  override onRemove(): void {
    blackSprite = undefined;
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // Make the counters tick from 0 --> max --> 0, etc.
    if (v.run.fadingToBlack) {
      v.run.counters++;
      if (v.run.counters === num) {
        v.run.fadingToBlack = false;
      }
    } else {
      v.run.counters--;
      if (v.run.counters === 0) {
        v.run.fadingToBlack = true;
      }
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (blackSprite === undefined) {
      return;
    }

    let opacity = v.run.counters / 90;
    if (opacity > 1) {
      opacity = 1;
    }

    setSpriteOpacity(blackSprite, opacity);
    blackSprite.Render(VectorZero);
  }
}
