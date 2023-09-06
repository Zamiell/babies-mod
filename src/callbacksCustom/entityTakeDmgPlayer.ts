import { DamageFlag } from "isaac-typescript-definitions";
import { hasFlag, isFirstPlayer, ModCallbackCustom } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

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
  if (!isFirstPlayer(player)) {
    return undefined;
  }

  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return undefined;
  }
  const { baby } = currentBaby;

  // Check to see if this baby is immune to explosive damage.
  if (
    baby.explosionImmunity === true &&
    hasFlag(damageFlags, DamageFlag.EXPLOSION)
  ) {
    return false;
  }

  return undefined;
}
