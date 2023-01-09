import { DarkEsauVariant, EntityType } from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const BOTTOM_LEFT_GRID_INDEX = 92;

/** Starts with a friendly Dark Esau. */
export class FoundSoulBaby extends Baby {
  override onAdd(): void {
    const numDarkEsaus = Isaac.CountEntities(undefined, EntityType.DARK_ESAU);
    if (numDarkEsaus > 0) {
      return;
    }

    const bottomLeftPosition = g.r.GetGridPosition(BOTTOM_LEFT_GRID_INDEX);
    spawn(
      EntityType.DARK_ESAU,
      DarkEsauVariant.DARK_ESAU,
      0,
      bottomLeftPosition,
    );
  }
}
