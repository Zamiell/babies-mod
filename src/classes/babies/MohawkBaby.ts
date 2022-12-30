import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** +2 bombs + bombs are hearts. */
export class MohawkBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const bombs = g.p.GetNumBombs();

    // Bombs are hearts
    if (bombs === 0) {
      g.p.Kill();
    }
  }
}
