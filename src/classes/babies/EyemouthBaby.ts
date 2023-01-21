import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Shoots an extra tear every Nth shot. */
export class EyemouthBaby extends Baby {
  v = {
    run: {
      numFiredTears: 0,
    },
  };

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const num = this.getAttribute("num");

    this.v.run.numFiredTears++;
    // We need to add one to account for the extra shot tear.
    if (this.v.run.numFiredTears >= num + 1) {
      this.v.run.numFiredTears = 0;

      mod.runNextGameFrame(() => {
        player.FireTear(tear.Position, tear.Velocity, false, true, false);
      }, true);
    }
  }
}
