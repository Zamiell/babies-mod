import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { mod } from "../../mod";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numFiredTears: 0,
  },
};

/** Shoots an extra tear every Nth shot. */
export class EyemouthBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const num = this.getAttribute("num");

    v.run.numFiredTears++;
    // We need to add one to account for the extra shot tear.
    if (v.run.numFiredTears >= num + 1) {
      v.run.numFiredTears = 0;

      mod.runNextGameFrame(() => {
        player.FireTear(tear.Position, tear.Velocity, false, true, false);
      }, true);
    }
  }
}
