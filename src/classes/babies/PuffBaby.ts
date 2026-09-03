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
    if (doesBigChestExist()) {
      return;
    }

    const hearts = player.GetHearts();
    const soulHearts = player.GetSoulHearts();
    const boneHearts = player.GetBoneHearts();

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.MEGA_BEAN);
    }, num);
  }
}
