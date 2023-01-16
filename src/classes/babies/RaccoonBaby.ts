import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Random rocks. */
export class RaccoonBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const roomFrameCount = g.r.GetFrameCount();
    const isFirstVisit = g.r.IsFirstVisit();

    // Reroll all of the rocks in the room. This does not work if we do it in the `POST_NEW_ROOM`
    // callback. This does not work if we do it on the 0th frame.
    if (roomFrameCount === 1 && isFirstVisit) {
      useActiveItemTemp(player, CollectibleType.D12);
    }
  }
}
