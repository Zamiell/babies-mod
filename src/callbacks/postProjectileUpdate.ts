import { getCurrentBaby } from "../misc";
import postProjectileUpdateBabyFunctions from "./postProjectileUpdateBabies";

export function main(projectile: EntityProjectile): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postProjectileUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(projectile);
  }
}
