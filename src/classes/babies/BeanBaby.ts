import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { doesBigChestExist, everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Constant Butter Bean effect. */
export class BeanBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (doesBigChestExist()) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.BUTTER_BEAN);
    }, 1);
  }
}
