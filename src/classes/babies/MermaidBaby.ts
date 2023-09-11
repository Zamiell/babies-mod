import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Athame + 30 luck. */
export class MermaidBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.LUCK)
  evaluateCacheLuck(player: EntityPlayer): void {
    player.Luck += 30;
  }
}
