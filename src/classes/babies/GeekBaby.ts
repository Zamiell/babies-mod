import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getFamiliars } from "isaacscript-common";
import { getRandomOffsetPosition } from "../../utils";
import { Baby } from "../Baby";

/** Starts with 20x Robo-Baby 2.0 + blindfolded. */
export class GeekBaby extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.ROBO_BABY_2)
  postFamiliarUpdateRoboBaby2(familiar: EntityFamiliar): void {
    // All of the babies will stack on top of each other, so manually keep them spread apart.
    const roboBabies = getFamiliars(FamiliarVariant.ROBO_BABY_2);
    for (const roboBaby of roboBabies) {
      if (
        familiar.Position.Distance(roboBaby.Position) <= 1 &&
        // Use the index as a priority of which Gurdy is forced to move away.
        familiar.Index < roboBaby.Index
      ) {
        roboBaby.Position = getRandomOffsetPosition(
          roboBaby.Position,
          7,
          roboBaby.InitSeed,
        );
      }
    }
  }
}
