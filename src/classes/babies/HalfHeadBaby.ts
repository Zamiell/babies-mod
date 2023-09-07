import type { DamageFlag } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    dealingExtraDamage: false,
  },
};

/** Takes 2x damage. */
export class HalfHeadBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (v.room.dealingExtraDamage) {
      return undefined;
    }

    v.room.dealingExtraDamage = true;
    player.TakeDamage(amount, damageFlags, source, countdownFrames);
    v.room.dealingExtraDamage = false;

    return undefined;
  }
}
