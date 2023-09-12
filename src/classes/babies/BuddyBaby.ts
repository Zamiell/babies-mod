import { CollectibleType, DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  hasFlag,
  isSelfDamage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Removes a heart container on hit. */
export class BuddyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (hasFlag(damageFlags, DamageFlag.FAKE)) {
      return undefined;
    }

    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    const maxHearts = player.GetMaxHearts();

    if (maxHearts >= 2) {
      player.AddMaxHearts(-2, true);
      useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
      return false;
    }

    return undefined;
  }
}
