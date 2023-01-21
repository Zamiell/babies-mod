import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Double tears. */
export class MernBaby extends Baby {
  v = {
    run: {
      numFiredTears: 0,
    },
  };

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    this.v.run.numFiredTears++;
    if (this.v.run.numFiredTears >= 2) {
      this.v.run.numFiredTears = 0;

      mod.runNextGameFrame(() => {
        player.FireTear(tear.Position, tear.Velocity, false, true, false);
      }, true);
    }
  }
}
