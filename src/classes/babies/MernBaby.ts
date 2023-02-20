import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

const v = {
  run: {
    numFiredTears: 0,
  },
};

/** Double tears. */
export class MernBaby extends Baby {
  v = v;

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    v.run.numFiredTears++;
    if (v.run.numFiredTears >= 2) {
      v.run.numFiredTears = 0;

      mod.runNextGameFrame(() => {
        player.FireTear(tear.Position, tear.Velocity, false, true, false);
      }, true);
    }
  }
}
