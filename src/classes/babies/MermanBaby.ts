import { EntityType, SuckerVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, spawn } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Bulb on hit. */
export class MermanBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawn(EntityType.SUCKER, SuckerVariant.BULB, 0, player.Position);

    return undefined;
  }
}
