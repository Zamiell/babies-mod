import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Larynx effect every Nth tear. */
export class CrackedBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
      tear.Remove();
      player.UseActiveItem(CollectibleType.LARYNX);
    }
  }
}
