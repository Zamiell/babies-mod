import g from "../globals";
import { getCurrentBaby } from "../util";
import preRoomEntitySpawnBabyFunctions from "./preRoomEntitySpawnBabies";

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

  const babyFunc = preRoomEntitySpawnBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(entityType);
  }

  return undefined;
}
