import type { DamageFlag } from "isaac-typescript-definitions";
import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Teleport to starting room on hit. */
export class RottenMeatBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    useCardTemp(player, CardType.FOOL);
    return undefined;
  }
}
