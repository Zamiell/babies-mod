import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** +2 keys + keys are hearts. */
export class HopelessBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const keys = g.p.GetNumKeys();

    // Keys are hearts
    if (keys === 0) {
      g.p.Kill();
    }
  }
}
