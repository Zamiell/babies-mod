import { getCurrentBaby } from "../utils";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, main);
}

function main(
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
    variant !== FireplaceVariant.BLUE &&
    variant !== FireplaceVariant.WHITE
  ) {
    return [entityType, FireplaceVariant.BLUE, subType, initSeed];
  }

  return undefined;
}
