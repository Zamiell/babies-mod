import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns N Blue Flies on hit. */
export class HandsomeMrFrogBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const num = this.getAttribute("num");

    player.AddBlueFlies(num, player.Position, undefined);

    return undefined;
  }
}
