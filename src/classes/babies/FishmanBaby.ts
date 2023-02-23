import { BombSubType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, spawnBombPickupWithSeed } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random bomb on room clear. */
export class FishmanBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();

    spawnBombPickupWithSeed(BombSubType.NULL, player.Position, roomSeed);

    return undefined;
  }
}
