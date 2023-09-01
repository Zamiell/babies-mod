import { LevelStage } from "isaac-typescript-definitions";
import {
  onEffectiveStage,
  onStageWithNaturalDevilRoom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Goat Head. */
export class GoatHeadBaby extends Baby {
  /** We are guaranteed a Devil Room on Basement 2, so we don't want to have it there. */
  override isValid(): boolean {
    return (
      onStageWithNaturalDevilRoom() && !onEffectiveStage(LevelStage.BASEMENT_2)
    );
  }
}
