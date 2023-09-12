import { PillColor, PillEffect } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Lemon Party effect on hit. */
export class YellowBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    player.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);
    return undefined;
  }
}
