import { DamageFlag } from "isaac-typescript-definitions";
import { game, hasFlag } from "isaacscript-common";
import { g } from "../globals";
import { getCurrentBaby } from "../utils";
import { entityTakeDmgPlayerBabyFunctionMap } from "./entityTakeDmgPlayerBabyFunctionMap";

export function main(
  player: EntityPlayer,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  const gameFrameCount = game.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
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
      amount,
      damageFlags,
      source,
      countdownFrames,
    );
  }

  return undefined;
}
