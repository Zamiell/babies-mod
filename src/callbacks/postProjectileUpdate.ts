import { getCurrentBaby } from "../utils";
import { postProjectileUpdateBabyFunctionMap } from "./postProjectileUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, main);
}

function main(projectile: EntityProjectile) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postProjectileUpdateBabyFunction =
    postProjectileUpdateBabyFunctionMap.get(babyType);
  if (postProjectileUpdateBabyFunction !== undefined) {
    postProjectileUpdateBabyFunction(projectile);
  }
}
