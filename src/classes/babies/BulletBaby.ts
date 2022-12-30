import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Rocket in a Jar + infinite bombs + blindfolded. */
export class BulletBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    g.p.AddBombs(1);
  }
}
