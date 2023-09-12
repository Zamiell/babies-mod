import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** -1 coin/bomb/key on hit. */
export class N404Baby extends Baby {
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

    player.AddCoins(-1);
    player.AddBombs(-1);
    player.AddKeys(-1);

    return undefined;
  }
}
