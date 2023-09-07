import { DamageFlag } from "isaac-typescript-definitions";
import { hasFlag, ModCallbackCustom } from "isaacscript-common";
import { getBabyType } from "../classes/features/babySelection/v";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { BABIES } from "../objects/babies";
import { isValidRandomBabyPlayer } from "../utils";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER, main);
}

function main(
  player: EntityPlayer,
  _amount: float,
  damageFlags: BitFlags<DamageFlag>,
  _source: EntityRef,
  _countdownFrames: int,
): boolean | undefined {
  if (!isValidRandomBabyPlayer(player)) {
    return undefined;
  }

  const babyType = getBabyType();
  if (babyType === undefined) {
    return undefined;
  }

  const baby = BABIES[babyType] as BabyDescription;

  // Check to see if this baby is immune to explosive damage.
  if (
    baby.explosionImmunity === true &&
    hasFlag(damageFlags, DamageFlag.EXPLOSION)
  ) {
    return false;
  }

  return undefined;
}
