import { HeartSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getEnumValues,
  getRandomArrayElement,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const heartSubTypes = getEnumValues(HeartSubType);
    const heartSubType = getRandomArrayElement(heartSubTypes, roomSeed);

    spawnHeart(heartSubType, player.Position, VectorZero, player, roomSeed);

    return undefined;
  }
}
