import { DamageFlag } from "isaac-typescript-definitions";
import { hasFlag } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { entityTakeDmgPlayerBabyFunctionMap } from "./entityTakeDmgPlayerBabyFunctionMap";

export function main(
  player: EntityPlayer,
  damageAmount: float,
  damageFlags: BitFlags<DamageFlag>,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | undefined {
  const gameFrameCount = g.g.GetFrameCount();
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  if (g.run.dealingExtraDamage) {
    return undefined;
  }

  // Check to see if the player is supposed to be temporarily invulnerable.
  if (g.run.invulnerable) {
    return false;
  }
  if (
    g.run.invulnerabilityUntilFrame !== null &&
    gameFrameCount < g.run.invulnerabilityUntilFrame
  ) {
    return false;
  }

  // Check to see if this baby is immune to explosive damage.
  if (
    baby.explosionImmunity === true &&
    hasFlag(damageFlags, DamageFlag.EXPLOSION)
  ) {
    return false;
  }

  const entityTakeDmgPlayerBabyFunction =
    entityTakeDmgPlayerBabyFunctionMap.get(babyType);
  if (entityTakeDmgPlayerBabyFunction !== undefined) {
    return entityTakeDmgPlayerBabyFunction(
      player,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return undefined;
}
