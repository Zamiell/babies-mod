import {
  CallbackCustom,
  ModCallbackCustom,
  onStageWithSecretExitToMausoleum,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Invulnerability */
export class ZeroBaby extends Baby {
  /** -0- Baby cannot open the door to Mausoleum (since it requires health to be sacrificed). */
  override isValid(): boolean {
    return !onStageWithSecretExitToMausoleum();
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    return false;
  }
}
