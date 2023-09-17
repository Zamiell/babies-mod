import { CollectibleType, DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  addFlag,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const POTATO_PEELER_DAMAGE_FLAGS = addFlag(
  DamageFlag.RED_HEARTS, // 1 << 5
  DamageFlag.FAKE, // 1 << 21
);

/** Potato Peeler effect on hit. */
export class MeatBoyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const maxHearts = player.GetMaxHearts();

    return (
      maxHearts > 0 && !player.HasCollectible(CollectibleType.POTATO_PEELER)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    // Using Potato Peeler will cause damage, so we need to early return to prevent infinite
    // recursion.
    if (damageFlags === POTATO_PEELER_DAMAGE_FLAGS) {
      return;
    }

    useActiveItemTemp(player, CollectibleType.POTATO_PEELER);
    return undefined;
  }
}
