import { HeartSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  VectorZero,
  game,
  getRandomEnumValue,
  spawnHeart,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const randomHeartSubType = getRandomEnumValue(HeartSubType, roomSeed, [
      HeartSubType.NULL,
    ]);

    spawnHeart(
      randomHeartSubType,
      player.Position,
      VectorZero,
      player,
      roomSeed,
    );

    return undefined;
  }
}
