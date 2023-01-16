import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { doesBigChestExist, everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Mega Bean effect every 5 seconds. */
export class PuffBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const hearts = player.GetHearts();
    const soulHearts = player.GetSoulHearts();
    const boneHearts = player.GetBoneHearts();
    const num = this.getAttribute("num");

    if (doesBigChestExist()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.MEGA_BEAN);
    }, num);
  }
}
