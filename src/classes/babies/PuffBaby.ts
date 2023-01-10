import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { doesBigChestExist, everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Mega Bean effect every 5 seconds. */
export class PuffBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const hearts = g.p.GetHearts();
    const soulHearts = g.p.GetSoulHearts();
    const boneHearts = g.p.GetBoneHearts();
    const num = this.getAttribute("num");

    if (doesBigChestExist()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.MEGA_BEAN);
    }, num);
  }
}
