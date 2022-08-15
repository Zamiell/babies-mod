import { DamageFlag } from "isaac-typescript-definitions";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { entityTakeDmgEntityBabyFunctionMap } from "./entityTakeDmgEntityBabyFunctionMap";

export function main(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
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
      amount,
      damageFlags,
      source,
      countdownFrames,
    );
  }

  return undefined;
}
