import { HeartSubType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getEnumValues,
  getRandomArrayElement,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import g from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  private preSpawnClearAward(): boolean | undefined {
    const roomSeed = g.r.GetSpawnSeed();
    const heartSubTypes = getEnumValues(HeartSubType);
    const heartSubType = getRandomArrayElement(heartSubTypes, roomSeed);
    spawnHeart(heartSubType, g.p.Position, VectorZero, g.p, roomSeed);

    return undefined;
  }
}
