import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Tear size increases with distance. */
export class CylinderBaby extends Baby {
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    tear.SpriteScale = Vector(
      tear.SpriteScale.X + 0.1,
      tear.SpriteScale.Y + 0.1,
    );
  }
}
