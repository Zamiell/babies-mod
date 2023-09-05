import { BombSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getRandom,
  spawnBombPickupWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random bomb on room clear. */
export class FishmanBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();

    // A bomb sub-type of `NULL` will never spawn a Giga Bomb, so we provide a small chance of that
    // happening. (We want it to be slightly lower than the chance for a Golden Troll Bomb, which is
    // the most unlikely thing in vanilla.)
    const chance = getRandom(roomSeed);
    const bombSubType = chance < 0.001 ? BombSubType.GIGA : BombSubType.NULL;
    spawnBombPickupWithSeed(bombSubType, player.Position, roomSeed);

    return undefined;
  }
}
