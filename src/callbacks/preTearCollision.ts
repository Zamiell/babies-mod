import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { preTearCollisionBabyFunctionMap } from "./preTearCollisionBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_TEAR_COLLISION, main);
}

function main(tear: EntityTear, collider: Entity): boolean | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const preTearCollisionBabyFunction =
    preTearCollisionBabyFunctionMap.get(babyType);
  if (preTearCollisionBabyFunction !== undefined) {
    return preTearCollisionBabyFunction(tear, collider);
  }

  return undefined;
}
