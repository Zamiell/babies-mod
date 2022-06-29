import {
  EntityType,
  FireplaceVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_ENTITY_SPAWN, main);
}

function main(
  entityType: EntityType,
  variant: int,
  subType: int,
  _position: Vector,
  _velocity: Vector,
  _spawner: Entity | undefined,
  initSeed: int,
): [int, int, int, int] | undefined {
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  if (
    baby.name === "Purple Baby" && // 252
    entityType === EntityType.FIREPLACE &&
    variant !== (FireplaceVariant.BLUE as int) &&
    variant !== (FireplaceVariant.WHITE as int)
  ) {
    return [entityType, FireplaceVariant.BLUE, subType, initSeed];
  }

  return undefined;
}
