import { CallbackPriority } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  PriorityCallbackCustom,
  onStageWithSecretExitToMausoleum,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Invulnerability */
export class ZeroBaby extends Baby {
  /** -0- Baby cannot open the door to Mausoleum (since it requires health to be sacrificed). */
  override isValid(): boolean {
    return !onStageWithSecretExitToMausoleum();
  }

  /**
   * This needs to have precedence over the Racing+ callbacks so that the player does not lose their
   * free devil deal.
   */
  @PriorityCallbackCustom(
    ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER,
    CallbackPriority.EARLY,
  )
  entityTakeDmgPlayer(): boolean | undefined {
    return false;
  }
}
