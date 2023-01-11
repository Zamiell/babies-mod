import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Level 4 Bumbo (improved). */
export class GravenBaby extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.BUMBO)
  postFamiliarInitBumbo(familiar: EntityFamiliar): void {
    // Bumbo needs 25 coins to reach the max level.
    familiar.Coins = 25;
  }
}
