import {
  EntityType,
  LevelStage,
  StageType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onEffectiveStage,
  onStageType,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Slippery movement. */
export class DriverBaby extends Baby {
  /** The water currents can cause a soft-lock. */
  override isValid(): boolean {
    const onDownpourOrDross =
      onEffectiveStage(LevelStage.BASEMENT_1, LevelStage.BASEMENT_2) &&
      onStageType(StageType.REPENTANCE, StageType.REPENTANCE_B);

    return !onDownpourOrDross;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws.
    removeAllMatchingEntities(EntityType.GAPING_MAW);
    removeAllMatchingEntities(EntityType.BROKEN_GAPING_MAW);
  }
}
