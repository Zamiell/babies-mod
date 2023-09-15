import type { DamageFlag } from "isaac-typescript-definitions";
import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** D7 effect on hit. */
export class LostGreyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.D7);
  }

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

    useActiveItemTemp(player, CollectibleType.D7);
    return undefined;
  }
}
