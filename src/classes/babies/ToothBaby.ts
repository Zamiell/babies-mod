import { KeySubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getRandomEnumValue,
  spawnKeyWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random key on room clear. */
export class ToothBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomKeySubType = getRandomEnumValue(KeySubType, roomSeed, [
      KeySubType.NULL,
    ]);
    spawnKeyWithSeed(randomKeySubType, player.Position, roomSeed);

    return undefined;
  }
}
