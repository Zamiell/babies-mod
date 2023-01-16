import { HeartSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getEnumValues,
  getRandomArrayElement,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const roomSeed = g.r.GetSpawnSeed();
    const player = Isaac.GetPlayer();
    const heartSubTypes = getEnumValues(HeartSubType);
    const heartSubType = getRandomArrayElement(heartSubTypes, roomSeed);

    spawnHeart(heartSubType, player.Position, VectorZero, player, roomSeed);

    return undefined;
  }
}
