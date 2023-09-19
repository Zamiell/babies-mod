import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

export class BabyStats extends BabyModFeature {
  @Callback(ModCallback.EVALUATE_CACHE)
  evaluateCache(player: EntityPlayer, cacheFlag: CacheFlag): void {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }

    const baby: BabyDescription = BABIES[babyType];

    // Give the Random Baby character a flat +1 damage as a bonus, similar to Samael.
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage++;
    }

    // Handle flying characters.
    if (cacheFlag === CacheFlag.FLYING && baby.flight === true) {
      player.CanFly = true;
    }
  }
}
