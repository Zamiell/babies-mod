import {
  CallbackCustom,
  ModCallbackCustom,
  openAllDoors,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Doors open on hit. */
export class ConjoinedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    openAllDoors();

    return undefined;
  }
}
