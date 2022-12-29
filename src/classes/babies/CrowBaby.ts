import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat, spawnFamiliar } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Dead Bird (improved). */
export class CrowBaby extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.DEAD_BIRD)
  private postFamiliarInitDeadBird(): void {
    if (g.run.babyBool) {
      return;
    }

    // Spawn 5 bird familiars instead of 1. (1 is already spawned.)
    g.run.babyBool = true;
    repeat(4, () => {
      spawnFamiliar(FamiliarVariant.DEAD_BIRD, 0, g.p.Position);
    });
    g.run.babyBool = false;
  }
}
