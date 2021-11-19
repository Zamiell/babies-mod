import { getCurrentBaby } from "../util";

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

  if (
    baby.name === "Purple Baby" && // 252
    entityType === EntityType.ENTITY_FIREPLACE &&
    variant !== FireplaceVariant.BLUE
  ) {
    return [entityType, FireplaceVariant.BLUE, subType, initSeed];
  }

  return undefined;
}
