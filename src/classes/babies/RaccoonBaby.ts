import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Random rocks. */
export class RaccoonBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const roomFrameCount = g.r.GetFrameCount();
    const isFirstVisit = g.r.IsFirstVisit();

    // Reroll all of the rocks in the room. This does not work if we do it in the `POST_NEW_ROOM`
    // callback. This does not work if we do it on the 0th frame.
    if (roomFrameCount === 1 && isFirstVisit) {
      useActiveItemTemp(g.p, CollectibleType.D12);
    }
  }
}
