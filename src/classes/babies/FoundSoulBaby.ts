import { DarkEsauVariant, EntityType } from "isaac-typescript-definitions";
import { doesEntityExist, game, spawn } from "isaacscript-common";
import { Baby } from "../Baby";

const BOTTOM_LEFT_GRID_INDEX = 92;

/** Starts with a friendly Dark Esau. */
export class FoundSoulBaby extends Baby {
  override onAdd(): void {
    if (doesEntityExist(EntityType.DARK_ESAU)) {
      return;
    }

    const room = game.GetRoom();
    const bottomLeftPosition = room.GetGridPosition(BOTTOM_LEFT_GRID_INDEX);

    spawn(
      EntityType.DARK_ESAU,
      DarkEsauVariant.DARK_ESAU,
      0,
      bottomLeftPosition,
    );
  }
}
