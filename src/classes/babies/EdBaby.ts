import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, copyColor, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** Fire trail tears. */
export class EdBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType === 1 && tear.FrameCount % 2 === 0) {
      const fire = spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, tear.Position);
      fire.SpriteScale = Vector(0.5, 0.5);

      // Fade the fire so that it is easier to see everything.
      const color = fire.GetColor();
      const fadeAmount = 0.5;
      const newColor = copyColor(color);
      newColor.A = fadeAmount;
      fire.SetColor(newColor, 0, 0, true, true);
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
