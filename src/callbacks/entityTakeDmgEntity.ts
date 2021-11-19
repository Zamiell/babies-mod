import g from "../globals";
import { getCurrentBaby } from "../util";
import { entityTakeDmgEntityBabyFunctionMap } from "./entityTakeDmgEntityBabyFunctionMap";

export function main(
  entity: Entity,
  damageAmount: float,
  damageFlags: int,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  if (g.run.dealingExtraDamage) {
    return undefined;
  }

  const entityTakeDmgEntityBabyFunction =
    entityTakeDmgEntityBabyFunctionMap.get(babyType);
  if (entityTakeDmgEntityBabyFunction !== undefined) {
    return entityTakeDmgEntityBabyFunction(
      entity,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return undefined;
}
