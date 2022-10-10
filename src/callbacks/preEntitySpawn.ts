import {
  EntityType,
  FireplaceVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";

export function init(): void {
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
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  if (
    babyType === RandomBabyType.PURPLE && // 252
    entityType === EntityType.FIREPLACE &&
    variant !== (FireplaceVariant.BLUE as int) &&
    variant !== (FireplaceVariant.WHITE as int)
  ) {
    return [entityType, FireplaceVariant.BLUE, subType, initSeed];
  }

  return undefined;
}
