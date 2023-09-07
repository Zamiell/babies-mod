import { DamageFlag } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, hasFlag } from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

export class ExplosionImmunity extends BabyModFeature {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
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

    const baby = BABIES[babyType] as BabyDescription;

    if (
      baby.explosionImmunity === true &&
      hasFlag(damageFlags, DamageFlag.EXPLOSION)
    ) {
      return false;
    }

    return undefined;
  }
}
