import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  openAllDoors,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Doors open on hit. */
export class ConjoinedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    openAllDoors();

    return undefined;
  }
}
