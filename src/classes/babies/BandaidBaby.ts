import {
  CollectibleType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import { Callback, getRandom } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** 50% chance to spawn a random pedestal item on room clear. */
export class BandaidBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const roomType = g.r.GetType();
    const roomSeed = g.r.GetSpawnSeed();
    const player = Isaac.GetPlayer();

    if (roomType === RoomType.BOSS) {
      return undefined;
    }

    const chance = getRandom(g.run.rng);
    if (chance < 0.5) {
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
    }

    return undefined;
  }
}
