import { CoinSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getRandomEnumValue,
  spawnCoinWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random coin on room clear. */
export class PunkgirlBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomCoinSubType = getRandomEnumValue(CoinSubType, roomSeed, [
      CoinSubType.NULL,
    ]);
    spawnCoinWithSeed(randomCoinSubType, player.Position, roomSeed);

    return undefined;
  }
}
