import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with 3x YO LISTEN (improved). */
export class PixieBaby extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.YO_LISTEN)
  postFamiliarUpdateYoListen(familiar: EntityFamiliar): void {
    // Speed it up.
    if (familiar.FrameCount % 5 === 0) {
      familiar.Velocity = familiar.Velocity.mul(2);
    }
  }
}
