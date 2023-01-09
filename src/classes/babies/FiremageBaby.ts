import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Fire Mind + 13 luck. */
export class FiremageBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.LUCK)
  evaluateCacheLuck(player: EntityPlayer): void {
    player.Luck += 13;
  }
}
