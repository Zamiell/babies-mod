import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a fire on hit. */
export class FieryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    player.ShootRedCandle(VectorZero);

    return undefined;
  }
}
