import { BombSubType, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnBombPickupWithSeed } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random bomb on room clear. */
export class FishmanBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const roomSeed = g.r.GetSpawnSeed();

    spawnBombPickupWithSeed(BombSubType.NULL, g.p.Position, roomSeed);

    return undefined;
  }
}
