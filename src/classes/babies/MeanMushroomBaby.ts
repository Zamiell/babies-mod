import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Is frozen on hit. */
export class MeanMushroomBaby extends Baby {
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

    const controlsEnabled = player.AreControlsEnabled();
    if (!controlsEnabled) {
      return undefined;
    }

    const num = this.getAttribute("num");
    player.AnimateSad();
    player.AddControlsCooldown(num);

    return undefined;
  }
}
