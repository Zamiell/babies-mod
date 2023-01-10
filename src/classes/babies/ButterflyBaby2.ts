import { EntityGridCollisionClass } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Flight + can walk through walls. */
export class ButterflyBaby2 extends Baby {
  override onRemove(player: EntityPlayer): void {
    player.GridCollisionClass = EntityGridCollisionClass.GROUND;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    player.GridCollisionClass = EntityGridCollisionClass.NONE;
  }
}
