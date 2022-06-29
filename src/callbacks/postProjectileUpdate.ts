import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postProjectileUpdateBabyFunctionMap } from "./postProjectileUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PROJECTILE_UPDATE, main);
}

function main(projectile: EntityProjectile) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postProjectileUpdateBabyFunction =
    postProjectileUpdateBabyFunctionMap.get(babyType);
  if (postProjectileUpdateBabyFunction !== undefined) {
    postProjectileUpdateBabyFunction(projectile);
  }
}
