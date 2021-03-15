import g from "../globals";
import * as misc from "../misc";
import preRoomEntitySpawnBabyFunctions from "./preRoomEntitySpawnBabies";

export function main(
  entityType: int,
  _variant: int,
  _subType: int,
  _gridIndex: int,
  _seed: int,
): [int, int, int] | null {
  // Local variables
  const roomFrameCount = g.r.GetFrameCount();
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  // We only care about replacing things when the room is first loading and on the first visit
  if (roomFrameCount !== -1) {
    return null;
  }

  const babyFunc = preRoomEntitySpawnBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(entityType);
  }

  return null;
}
