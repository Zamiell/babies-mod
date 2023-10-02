import { CallbackPriority, DamageFlag } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  PriorityCallbackCustom,
  hasFlag,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

export class ExplosionImmunity extends BabyModFeature {
  /**
   * This needs to have precedence over the Racing+ callbacks so that the player does not lose their
   * free devil deal.
   */
  @PriorityCallbackCustom(
    ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER,
    CallbackPriority.EARLY,
  )
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return undefined;
    }
    const baby: BabyDescription = BABIES[babyType];

    if (
      baby.explosionImmunity === true &&
      hasFlag(damageFlags, DamageFlag.EXPLOSION)
    ) {
      return false;
    }

    return undefined;
  }
}
