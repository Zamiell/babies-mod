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

  /*
  log(
    `MC_ENTITY_TAKE_DMG - damageAmount: ${damageAmount}, damageFlags: ${damageFlags}, damageSource: ${damageSource.Type}.${damageSource.Variant}`,
  );
  */

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
