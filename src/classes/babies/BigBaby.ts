import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Everything is giant. */
export class BigBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    // This does not work if we put it in the `POST_NEW_LEVEL` callback for some reason.
    if (g.p.SpriteScale.X < 2 || g.p.SpriteScale.Y < 2) {
      g.p.SpriteScale = Vector(2, 2);
    }
  }
}
