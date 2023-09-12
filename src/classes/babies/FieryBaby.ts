import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a friendly fire on hit. */
export class FieryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    player.ShootRedCandle(VectorZero);

    return undefined;
  }
}
