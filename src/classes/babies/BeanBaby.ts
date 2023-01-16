import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { doesBigChestExist, everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Constant Butter Bean effect. */
export class BeanBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (doesBigChestExist()) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.BUTTER_BEAN);
    }, 1);
  }
}
