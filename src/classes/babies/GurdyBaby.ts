import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getFamiliars } from "isaacscript-common";
import { getRandomOffsetPosition } from "../../utils";
import { Baby } from "../Baby";

/** Starts with 20x Lil Gurdy. */
export class GurdyBaby extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.LIL_GURDY)
  postFamiliarUpdateLilGurdy(familiar: EntityFamiliar): void {
    // All of the Gurdies will stack on top of each other, so manually keep them spread apart.
    const lilGurdies = getFamiliars(FamiliarVariant.LIL_GURDY);
    for (const lilGurdy of lilGurdies) {
      if (
        familiar.Position.Distance(lilGurdy.Position) <= 1
        // Use the index as a priority of which familiar is forced to move away.
        && familiar.Index < lilGurdy.Index
      ) {
        lilGurdy.Position = getRandomOffsetPosition(
          lilGurdy.Position,
          7,
          lilGurdy.InitSeed,
        );
      }
    }
  }
}
