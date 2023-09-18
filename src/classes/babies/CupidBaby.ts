import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Base Larynx effect every 8 tears. */
export class CupidBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");
    const player = Isaac.GetPlayer();

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
      tear.Remove();
      player.UseActiveItem(CollectibleType.LARYNX);
    }
  }
}
