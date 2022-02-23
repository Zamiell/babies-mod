import g from "../globals";
import { getCurrentBaby } from "../utils";
import { preRoomEntitySpawnBabyFunctionMap } from "./preRoomEntitySpawnBabyFunctionMap";

export function main(
  entityType: int,
  _variant: int,
  _subType: int,
  _gridIndex: int,
  _seed: int,
): [int, int, int] | void {
  const roomFrameCount = g.r.GetFrameCount();
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // We only care about replacing things when the room is first loading and on the first visit
  if (roomFrameCount !== -1) {
    return undefined;
  }

  const preRoomEntitySpawnBabyFunction =
    preRoomEntitySpawnBabyFunctionMap.get(babyType);
  if (preRoomEntitySpawnBabyFunction !== undefined) {
    return preRoomEntitySpawnBabyFunction(entityType);
  }

  return undefined;
}
