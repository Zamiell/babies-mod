import g from "../globals";
import { getCurrentBaby } from "../misc";

export function main(
  entityType: int,
  variant: int,
  subType: int,
  _position: Vector,
  _velocity: Vector,
  _spawner: Entity,
  initSeed: int,
): [int, int, int, int] | void {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  if (entityType === EntityType.ENTITY_SLOT && g.run.clockworkAssembly) {
    g.run.clockworkAssembly = false;
    return [entityType, 10, subType, initSeed];
  }

  if (
    baby.name === "Purple Baby" && // 252
    entityType === EntityType.ENTITY_FIREPLACE &&
    variant !== 2 // Blue Fire Place
  ) {
    return [entityType, 2, subType, initSeed];
  }

  return undefined;
}
