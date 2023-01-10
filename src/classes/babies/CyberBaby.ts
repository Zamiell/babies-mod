import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { spawnRandomPickup } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a random pickup on hit. */
export class CyberBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnRandomPickup(player.Position);

    return undefined;
  }
}
