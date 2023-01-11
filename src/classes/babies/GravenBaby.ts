import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Level 4 Bumbo (improved). */
export class GravenBaby extends Baby {
  // 6
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.BUMBO)
  postFamiliarUpdateBumbo(familiar: EntityFamiliar): void {
    // Speed it up.
    if (familiar.FrameCount % 5 === 0) {
      familiar.Velocity = familiar.Velocity.mul(2);
    }
  }

  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.BUMBO)
  postFamiliarInitBumbo(familiar: EntityFamiliar): void {
    // Bumbo needs 25 coins to reach the max level.
    familiar.Coins = 25;
  }
}
