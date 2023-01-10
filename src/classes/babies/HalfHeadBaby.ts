import { DamageFlag } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Takes 2x damage. */
export class HalfHeadBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (g.run.dealingExtraDamage) {
      return undefined;
    }

    g.run.dealingExtraDamage = true;
    player.TakeDamage(amount, damageFlags, source, countdownFrames);
    g.run.dealingExtraDamage = false;

    return undefined;
  }
}
