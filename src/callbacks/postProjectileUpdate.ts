import { getCurrentBaby } from "../util";
import { postProjectileUpdateBabyFunctionMap } from "./postProjectileUpdateBabyFunctionMap";

export function main(projectile: EntityProjectile): void {
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
