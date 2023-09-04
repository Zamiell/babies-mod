import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Mega Troll Bomb every N seconds. */
export class BurningBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.LUCK)
  evaluateCacheLuck(player: EntityPlayer): void {
    player.Luck += 40;
  }
}
